import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

const privatekey = process.env.GOOGLE_DRIVE_API_KEY;


export class GoogleDriveService {
  private readonly drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: {
      private_key: privatekey,
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async listFiles() {
    try {
      const response = await this.drive.files.list({
        pageSize: 10,
        fields: 'files(name, mimeType)',
      });

      const files = response.data.files;
      if (files && files.length) {
        console.log('List of files on Google Drive:');
        files.forEach((file) => {
          console.log(`${file.name} (${file.mimeType})`);
        });
      } else {
        console.log('There are no files on Google Drive.');
      }
    } catch (error) {
      console.error('An error occurred while getting the list of files:', error);
    }
  }

  async uploadFileToDrive(filePath: string, mimeType: string) {
    const fileStream = fs.createReadStream(filePath);
  const fileName = path.basename(filePath);

    const fileMetadata = {
      name: fileName,
    };

    const media = {
      mimeType,
      body: fileStream,
    };

    try {
      const response = await this.drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
      });

      console.log('File uploaded successfully. File ID:', response.data.id);
    } catch (error) {
      console.error('File upload error:', error.message);
    }
  }
}
