import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { User } from '@entities/users/users.entity';
import {
  Configuration,
  EmailsApi,
  EmailMessageData,
} from '@elasticemail/elasticemail-client-ts-axios';

@Injectable()
export class MailService {
  private readonly elasticEmailService: EmailsApi;
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
      const config = new Configuration({
        apiKey: process.env.ELASTIC_API_KEY,
      });
  
      this.elasticEmailService = new EmailsApi(config);
    }

    async checkEmailUnique(email: string): Promise<boolean> {
        const isUnique = await this.userRepository.findOne({ where: { email } });
        return !isUnique;
      }

      async sendEmail(emailTo: string, firstName: string, verifyLink:string): Promise<any> {
        
        try {
          const emailMessageData: EmailMessageData = {
            Recipients: [
              {
                Email: emailTo,
                Fields: {
                  name: firstName,
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
                  Content: `Hi ${firstName}!`,
                },
              ],
              From: 'internship@softryzen.com',
              Subject: 'Example verify email',
            },
          };
              
    
          const response = await this.elasticEmailService.emailsPost(emailMessageData);
          console.log('API called successfully.');
          console.log(response.data);
        } catch (error) {
          console.error(error);
          throw new Error('Failed to send email');
        }
      }
}
