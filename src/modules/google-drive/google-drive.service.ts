import { Injectable } from '@nestjs/common';
import { drive_v3, google, sheets_v4 } from 'googleapis';
import {
  columnNames,
  technicalTestCellData,
  testingCellData,
  userCellData,
} from './utils/column-name';

import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { TestEntity } from '@entities/testing/testing.entity';
import { UserEntity } from '@entities/users/users.entity';

import { SHEET_DEFAULT_NAME } from '@src/constants/constants';

@Injectable()
export class GoogleDriveService {
  private readonly drive: drive_v3.Drive;
  private readonly sheets: sheets_v4.Sheets;
  private readonly countColumns: number;
  private readonly countRows: number;
  private readonly folderId: string;
  private readonly columnNames: string[];
  private readonly userCellData: { [key: string]: string | string[] };
  private readonly technicalTestCellData: { [key: string]: string };
  private readonly testingCellData: { [key: string]: string };
  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY.split(String.raw`\n`).join(
          '\n',
        ),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ],
    });
    this.drive = google.drive({
      version: 'v3',
      auth,
    });
    this.sheets = google.sheets({
      version: 'v4',
      auth,
    });
    this.countColumns = 50;
    this.countRows = 1000;
    this.folderId = process.env.TARGET_FOLDER_ID_SPREADSHEET;
    this.columnNames = columnNames;
    this.userCellData = userCellData;
    this.technicalTestCellData = technicalTestCellData;
    this.testingCellData = testingCellData;
  }

  public async createSpreadsheetInFolder(
    spreadsheetName: string,
    titles: string[],
  ) {
    const spreadsheet = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: spreadsheetName,
        },
        sheets: titles.map((title) => ({
          properties: {
            title: title,
            gridProperties: {
              rowCount: this.countRows,
              columnCount: this.countColumns,
            },
          },
        })),
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;

    const response = await this.getSpreadsheetsInfo(spreadsheetId, titles);

    const sheets = response.data.sheets || [];

    for (const sheet of sheets) {
      const sheetId = sheet.properties?.sheetId;

      if (sheetId) {
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheet.properties?.title}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [this.columnNames],
          },
        });

        await this.columnSizeByValue(spreadsheetId, sheetId);

        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: sheetId,
                    gridProperties: {
                      frozenRowCount: 1,
                    },
                  },
                  fields: 'gridProperties.frozenRowCount',
                },
              },
            ],
          },
        });

        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 0,
                    endRowIndex: this.countRows,
                    startColumnIndex: 0,
                    endColumnIndex: this.countColumns,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 0.85, green: 0.85, blue: 0.85 },
                    },
                  },
                  fields: 'userEnteredFormat.backgroundColor',
                },
              },
              {
                updateCells: {
                  range: {
                    sheetId: sheetId,
                    startRowIndex: 1,
                    endRowIndex: this.countRows,
                    startColumnIndex: 0,
                    endColumnIndex: this.countColumns,
                  },
                  fields: 'userEnteredFormat.backgroundColor',
                  rows: Array.from(
                    { length: this.countRows - 1 },
                    (_, index) => ({
                      values: Array.from({ length: this.countColumns }, () => ({
                        userEnteredFormat: {
                          backgroundColor:
                            index % 2 === 0
                              ? {
                                  red: 0.95,
                                  green: 0.95,
                                  blue: 0.95,
                                }
                              : { red: 0.99, green: 0.99, blue: 0.99 },
                        },
                      })),
                    }),
                  ),
                },
              },
            ],
          },
        });
      }
    }

    await this.drive.files.update({
      fileId: spreadsheetId,
      addParents: this.folderId,
      removeParents: 'root',
      requestBody: {},
    });

    return spreadsheetId;
  }

  public async addInfoUserToAllAndDirectionSheets(
    spreadsheetId: string,
    body: UserEntity,
  ) {
    if (!body.direction) {
      await this.addInfoUserToSpreadsheet(
        spreadsheetId,
        SHEET_DEFAULT_NAME,
        body,
      );
    }

    if (body.direction) {
      const { userID } = await this.getIdsColumn(spreadsheetId, body.direction);
      const isExistUser = userID.includes(body.id);

      if (!isExistUser) {
        await this.addInfoUserToSpreadsheet(
          spreadsheetId,
          body.direction,
          body,
        );
      }

      await this.updateInfoUserToSpreadsheet(
        spreadsheetId,
        body,
        SHEET_DEFAULT_NAME,
        this.userCellData as { [key: string]: string },
      );
    }
  }

  public async updateInfoTestingSpreadsheet(
    spreadsheetId: string,
    body: TestEntity,
    range: string,
  ) {
    await this.updateInfoUserToSpreadsheet(
      spreadsheetId,
      body,
      SHEET_DEFAULT_NAME,
      this.testingCellData,
    );

    await this.updateInfoUserToSpreadsheet(
      spreadsheetId,
      body,
      range,
      this.testingCellData,
    );
  }

  public async updateInfoTechnicalTestSpreadsheet(
    spreadsheetId: string,
    body: ResultTechnicalTestEntity,
    range: string,
  ) {
    await this.updateInfoUserToSpreadsheet(
      spreadsheetId,
      body,
      SHEET_DEFAULT_NAME,
      this.testingCellData,
    );

    await this.updateInfoUserToSpreadsheet(
      spreadsheetId,
      body,
      range,
      this.technicalTestCellData,
    );
  }

  private async addInfoUserToSpreadsheet(
    spreadsheetId: string,
    sheetName: string,
    body: UserEntity,
  ) {
    const keys = Object.keys(this.userCellData);
    const response = await this.getSpreadsheetsInfo(spreadsheetId, [sheetName]);

    const sheet = response.data.sheets[0];
    const sheetId = sheet.properties?.sheetId;

    const cellData = [];

    keys.forEach((cell) => {
      const cellValue = this.extractData(body, this.userCellData[cell]);
      cellData.push(cellValue);
    });

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: 'RAW',
      requestBody: {
        values: [cellData],
      },
    });

    await this.columnSizeByValue(spreadsheetId, sheetId);
  }

  private async updateInfoUserToSpreadsheet(
    spreadsheetId: string,
    body: any,
    range: string,
    obj: { [key: string]: string },
  ) {
    const rowResponse = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${range}!1:1`,
    });

    const rowValues = rowResponse.data.values[0];
    const keys = Object.keys(obj);

    const { userIds, userID } = await this.getIdsColumn(spreadsheetId, range);

    if (userIds && userID.includes(body?.id)) {
      const valueUpdate = [];
      const userRowIndex = userID.indexOf(body?.id) + 1;

      const columnIndexArray = keys.map((columnName) => {
        if (Array.isArray(obj[columnName])) {
          valueUpdate.push(this.extractData(body, obj[columnName]));
          return;
        }
        valueUpdate.push(body[obj[columnName]]);
        return rowValues.indexOf(columnName) + 1;
      });

      const columnRange = columnIndexArray.map((columnIndex) =>
        String.fromCharCode(64 + columnIndex),
      );

      const userRange = `${range}!${columnRange[0]}${userRowIndex}:${
        columnRange[columnRange.length - 1]
      }${userRowIndex}`;

      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: userRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [valueUpdate],
        },
      });
    }
  }

  private async getSpreadsheetsInfo(spreadsheetId: string, titles: string[]) {
    return await this.sheets.spreadsheets.get({
      spreadsheetId,
      ranges: titles,
    });
  }

  private extractData(body: UserEntity, value: string | string[]) {
    if (Array.isArray(value)) {
      return `${body[value[0]]} ${body[value[1]]}`;
    }

    if (typeof body[value] === 'boolean') {
      return body[value] ? 'Так' : 'Ні';
    }
    return body[value] !== undefined ? body[value] : '';
  }

  private async columnSizeByValue(spreadsheetId: string, sheetId: number) {
    return await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: this.columnNames.map((_, index) => ({
          autoResizeDimensions: {
            dimensions: {
              sheetId: sheetId,
              dimension: 'COLUMNS',
              startIndex: index,
              endIndex: index + 1,
            },
          },
        })),
      },
    });
  }

  private async getIdsColumn(spreadsheetId: string, range: string) {
    const columnResponse = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${range}!A:A`,
    });

    const columnValues = columnResponse.data.values;
    const userIds = columnValues.flat();
    const userID = userIds.map(Number);

    return { userIds, userID };
  }
}
