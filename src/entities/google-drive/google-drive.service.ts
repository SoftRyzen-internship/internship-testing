import { ResultTechnicalTestEntity } from '@entities/technical-test-result/result-test.entity';
import { UserEntity } from '@entities/users/users.entity';
import { Injectable } from '@nestjs/common';
import { drive_v3, google, sheets_v4 } from 'googleapis';
import {
  columnNames,
  technicalTestCellData,
  userCellData,
} from './utils/column-name';

@Injectable()
export class GoogleDriveService {
  private readonly drive: drive_v3.Drive;
  private readonly sheets: sheets_v4.Sheets;
  private readonly countColumns: number;
  private readonly countRows: number;
  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: process.env.GOOGLE_PRIVATE_KEY,
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
  }

  public async createSpreadsheetInFolder(
    folderId: string,
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
            values: [columnNames],
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
                    startRowIndex: 1,
                    endRowIndex: this.countRows,
                    startColumnIndex: 0,
                    endColumnIndex: this.countColumns,
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: { red: 1, green: 1, blue: 1 },
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
      addParents: folderId,
      removeParents: 'root',
      requestBody: {},
    });

    return spreadsheetId;
  }

  public async addInfoUserToSpreadsheet(
    spreadsheetId: string,
    body: UserEntity,
  ) {
    const keys = Object.keys(userCellData);
    const response = await this.getSpreadsheetsInfo(spreadsheetId, [
      body.direction,
    ]);

    const sheet = response.data.sheets[0];
    const sheetId = sheet.properties?.sheetId;

    const cellData = [];

    keys.forEach((cell) => {
      const cellValue = this.extractData(body, userCellData[cell]);
      cellData.push(cellValue);
    });

    await this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: body.direction,
      valueInputOption: 'RAW',
      requestBody: {
        values: [cellData],
      },
    });

    await this.columnSizeByValue(spreadsheetId, sheetId);
  }

  public async updateInfoUserToSpreadsheet(
    spreadsheetId: string,
    body?: ResultTechnicalTestEntity,
  ) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'test1!A:A',
    });

    const key = Object.keys(technicalTestCellData);

    const userIds = response.data.values?.flat();
    const userID = userIds.map(Number);
    console.log('userIds', userIds);
    if (userIds && userID.includes(44)) {
      const userRowIndex = userID.indexOf(44) + 1;

      const userRange = `test1!${key
        .map((col) => `${col}${userRowIndex}`)
        .join(',')}`;
      await this.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: userRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['aaa', 'bbb', 'ccc', 'ddd']],
        },
      });

      console.log(`Значения для пользователя с ID ${44} успешно обновлены.`);
    } else {
      console.log(`Пользователь с ID ${44} не найден в таблице.`);
    }
  }

  private async getSpreadsheetsInfo(spreadsheetId: string, titles: string[]) {
    return await this.sheets.spreadsheets.get({
      spreadsheetId,
      ranges: titles,
    });
  }

  private extractData(body: any, value: string | string[]) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    if (Array.isArray(value)) {
      return `${body[value[0]]} ${body[value[1]]}`;
    }
    if (body[value] !== undefined && typeof body[value] === 'object') {
      const data = new Date(body[value]);
      if (dateRegex.test(data.toISOString())) {
        const day = data.getDay();
        const month = data.getMonth() + 1;
        const year = data.getFullYear();
        return `${day.toString().padStart(2, '0')}.${month
          .toString()
          .padStart(2, '0')}.${year}`;
      }
      return null;
    }
    return body[value] !== undefined ? body[value] : '';
  }

  private async columnSizeByValue(spreadsheetId: string, sheetId: number) {
    return await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: columnNames.map((_, index) => ({
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
}
