import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleDriveService {
  // public async createFolder(folderName: string) {
  //   const fileMetadata = {
  //     name: folderName,
  //     mimeType: 'application/vnd.google-apps.folder',
  //   };
  //   const res = await this.drive.files.create({
  //     requestBody: fileMetadata,
  //     fields: 'id',
  //   });
  //   const folderId = res.data.id;
  //   const res2 = await this.drive.permissions
  //     .create({
  //       requestBody: {
  //         type: 'user',
  //         role: 'owner',
  //         emailAddress: process.env.EMAIL_TO_SEND_FROM,
  //       },
  //       fileId: folderId,
  //       fields: 'id',
  //       transferOwnership: true,
  //       moveToNewOwnersRoot: true,
  //     })
  //     .catch((err) => console.log(err));
  //   return res2;
  // }
  // public async createSpreadsheetInFolder(
  //   folderId: string,
  //   spreadsheetName: string,
  // ) {
  //   const fileMetadata = {
  //     name: spreadsheetName,
  //     mimeType: 'application/vnd.google-apps.spreadsheet',
  //     parents: [folderId],
  //   };
  //   const res = await this.drive.files.create({
  //     requestBody: fileMetadata,
  //     fields: 'id',
  //   });
  // }
}
