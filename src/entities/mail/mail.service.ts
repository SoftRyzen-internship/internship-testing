import {
  Configuration,
  EmailMessageData,
  EmailsApi,
} from '@elasticemail/elasticemail-client-ts-axios';
import { User } from '@entities/users/users.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MailService {
  private readonly elasticEmailService: EmailsApi;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    const config = new Configuration({
      apiKey: process.env.ELASTIC_API_KEY,
    });

    this.elasticEmailService = new EmailsApi(config);
  }

  async checkEmailUnique(email: string): Promise<boolean> {
    const isUnique = await this.userRepository.findOne({ where: { email } });
    return !isUnique;
  }

  async sendEmail(
    emailTo: string,
    // firstName: string,
    verifyLink: string,
  ): Promise<any> {
    try {
      const emailMessageData: EmailMessageData = {
        Recipients: [
          {
            Email: emailTo,
            Fields: {
              name: 'New User',
            },
          },
        ],
        Content: {
          Body: [
            {
              ContentType: 'HTML',
              Charset: 'utf-8',
              Content: verifyLink,
            },
            {
              ContentType: 'PlainText',
              Charset: 'utf-8',
              Content: `Hi Dear User!`,
            },
          ],
          From: 'internship@softryzen.com',
          Subject: 'Example verify email',
        },
      };

      const response = await this.elasticEmailService.emailsPost(
        emailMessageData,
      );
      console.log('API called successfully.');
      console.log(response.data);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to send email');
    }
  }
}
