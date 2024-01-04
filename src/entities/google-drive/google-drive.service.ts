import { Injectable } from '@nestjs/common';
import { drive_v3, google, sheets_v4 } from 'googleapis';
import { columnNames } from './utils/column-name';

@Injectable()
export class GoogleDriveService {
  private readonly drive: drive_v3.Drive;
  private readonly sheets: sheets_v4.Sheets;
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
  }

  public async createSpreadsheetInFolder(
    folderId: string,
    spreadsheetName: string,
  ) {
    const keys = Object.keys(columnNames);
    const spreadsheet = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: spreadsheetName,
        },
        sheets: [
          {
            properties: {
              title: 'Frontend',
              gridProperties: {
                rowCount: 200,
                columnCount: 200,
              },
            },
          },
        ],
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    const sheetId = spreadsheet.data.sheets[0].properties.sheetId;

    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Frontend',
      valueInputOption: 'RAW',
      requestBody: {
        values: [keys],
      },
    });

    await this.drive.files.update({
      fileId: spreadsheetId,
      addParents: folderId,
      removeParents: 'root',
      requestBody: {},
    });

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: keys.map((_, index) => ({
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
                endRowIndex: 200,
                startColumnIndex: 0,
                endColumnIndex: 200,
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
                endRowIndex: 200,
                startColumnIndex: 0,
                endColumnIndex: 200,
              },
              fields: 'userEnteredFormat.backgroundColor',
              rows: Array.from({ length: 200 - 1 }, (_, index) => ({
                values: Array.from({ length: 200 }, () => ({
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
              })),
            },
          },
        ],
      },
    });

    await this.drive.files.update({
      fileId: spreadsheetId,
      addParents: folderId,
      removeParents: 'root',
      requestBody: {},
    });

    return spreadsheetId;
  }
}
