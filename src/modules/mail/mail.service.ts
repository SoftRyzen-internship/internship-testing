import {
  Configuration,
  EmailMessageData,
  EmailsApi,
} from '@elasticemail/elasticemail-client-ts-axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs/promises';
import * as mustache from 'mustache';
import { Repository } from 'typeorm';

import { ITemplateEmail } from './types/interfaces';

import { TokensService } from '../tokens/tokens.service';

import { UserEntity } from '@entities/users/users.entity';

@Injectable()
export class MailService {
  private readonly elasticEmailService: EmailsApi;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly tokensService: TokensService,
  ) {
    const config = new Configuration({
      apiKey: process.env.ELASTIC_API_KEY,
    });

    this.elasticEmailService = new EmailsApi(config);
  }

  // Check email
  public async checkEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('Email already exists');
    }
    return { available: true };
  }

  // Send email handler
  public async sendEmailHandler(
    email: string,
    verifyToken: string,
    path: string,
    firstName: string,
    isChangePassword: boolean,
  ) {
    const name = firstName ? firstName : email;
    const template = await this.generateTemplateHtmlMail(
      email,
      verifyToken,
      path,
      isChangePassword,
    );
    await this.sendEmail(email, template, name);

    return true;
  }

  // Verify email
  public async verifyEmail(verifyToken: string) {
    const user = await this.userRepository.findOne({
      where: { verifyToken },
      relations: ['roles'],
    });
    if (!user) {
      throw new BadRequestException('Email is verified');
    }
    await this.userRepository.update(user.id, {
      verified: true,
      verifyToken: null,
    });
    return await this.tokensService.generateTokens(user);
  }

  // Resend email
  public async resendEmail(
    email: string,
    path: string,
    isChangePassword: boolean,
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.verifyToken) {
      throw new BadRequestException('Email is verified');
    }
    const template = await this.generateTemplateHtmlMail(
      email,
      user.verifyToken,
      path,
      isChangePassword,
    );
    const name = user.firstName ? user.firstName : email;
    await this.sendEmail(email, template, name);

    return { message: 'Email resend' };
  }

  // Generate url for email send
  private async generateTemplateHtmlMail(
    name: string,
    verifyToken: string,
    path: string,
    isChangePassword: boolean | undefined,
  ) {
    const html = await fs.readFile(
      './src/modules/mail/template/index.html',
      'utf8',
    );

    const template: ITemplateEmail = {
      title: 'SoftRyzen',
      name,
      baseUrl: process.env.BASE_URL,
      path,
      verifyToken,
      message: '',
      confirmationMessage: '',
      confirmationLink: '',
    };

    if (!isChangePassword) {
      template.message = 'You are registering for an internship at SoftRyzen.';
      template.confirmationMessage =
        'To continue registration, confirm your email.';
      template.confirmationLink = 'Confirm email';
    }

    if (isChangePassword) {
      template.message = 'Request to change password.';
      template.confirmationMessage = 'To change your password, follow the link';
      template.confirmationLink = 'Change password';
    }

    const htmlTemplate = mustache.render(html, template);
    return htmlTemplate;
  }

  // Send email
  private async sendEmail(
    emailTo: string,
    template: string,
    firstName = 'Dear User',
  ) {
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
              Content: template,
            },
            {
              ContentType: 'PlainText',
              Charset: 'utf-8',
              Content: `Hi ${firstName}!`,
            },
          ],
          From: process.env.EMAIL_TO_SEND_FROM,
          Subject: 'Verify email',
        },
      };

      await this.elasticEmailService.emailsPost(emailMessageData);
      return true;
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }
}
