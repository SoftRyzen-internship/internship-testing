import {
  Configuration,
  EmailMessageData,
  EmailsApi,
} from '@elasticemail/elasticemail-client-ts-axios';
import { TokensService } from '@entities/tokens/tokens.service';
import { UserEntity } from '@entities/users/users.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VERIFY_EMAIL } from '@src/constants/mail-path.constants';
import * as fs from 'fs/promises';
import * as mustache from 'mustache';
import { Repository } from 'typeorm';
import { ITemplateEmail } from './types/interfaces';

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
    firstName?: string,
    isChangePassword?: boolean,
  ) {
    const name = firstName ? firstName : email;
    const linkForEmail = await this.generateUrlForEmailSend(
      email,
      verifyToken,
      path,
      isChangePassword,
    );
    await this.sendEmail(email, linkForEmail, name);

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
    path = VERIFY_EMAIL,
    isChangePassword?: boolean,
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.verifyToken) {
      throw new BadRequestException('Email is verified');
    }
    const linkForEmail = await this.generateUrlForEmailSend(
      email,
      user.verifyToken,
      path,
      isChangePassword,
    );
    const name = user.firstName ? user.firstName : email;
    await this.sendEmail(email, linkForEmail, name);

    return { message: 'Email resend' };
  }

  // Generate url for email send
  private async generateUrlForEmailSend(
    name: string,
    verifyToken: string,
    path: string,
    isChangePassword: boolean | undefined,
  ) {
    const html = await fs.readFile(
      './src/entities/mail/template/index.html',
      'utf8',
    );

    const template: ITemplateEmail = {
      title: 'SoftRyzen',
      name,
      baseUrl: process.env.BASE_URL,
      path,
      verifyToken,
      confirmationMessage: '',
      confirmationLink: 'Confirm email',
    };

    if (isChangePassword) {
      template.confirmationMessage =
        'To continue registration, confirm your email.';
    }

    if (!isChangePassword) {
      template.confirmationMessage =
        'to change your password, confirm your email';
    }

    // if (!isChangePassword) {
    //   return `<p>Hi ${name}, please confirm that this is your email address</p><a href="${process.env.BASE_URL}/api/${path}/${verifyToken}">Confirm email</a>`;
    // }

    // return `<p>Hi ${name}, to change your password, confirm your email</p><a href="${process.env.BASE_URL}/api/${path}/${verifyToken}">Confirm email</a>`;

    const htmlTemplate = mustache.render(html, template);
    return htmlTemplate;
  }

  // Send email
  private async sendEmail(
    emailTo: string,
    verifyLink: string,
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
              Content: verifyLink,
            },
            {
              ContentType: 'PlainText',
              Charset: 'utf-8',
              Content: `Hi ${firstName}!`,
            },
          ],
          From: process.env.EMAIL_TO_SEND_FROM,
          Subject: 'Example verify email',
        },
      };

      await this.elasticEmailService.emailsPost(emailMessageData);
      return true;
    } catch (error) {
      throw new Error('Failed to send email');
    }
  }
}
