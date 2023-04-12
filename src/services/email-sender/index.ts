import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import EmailSenderError from '~/services/email-sender/errors';

export type EmailSendParams = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

@Injectable()
export default class EmailSender {
  constructor(private mailerService: MailerService) {}

  public async send(params: EmailSendParams): Promise<void> {
    const { to, subject } = params;

    const mailOptions = {
      to,
      subject,
      text: params.text || '',
      html: params.html || '',
    };

    try {
      await this.mailerService.sendMail(mailOptions);
    } catch (err) {
      throw new EmailSenderError((err as Error).message, mailOptions);
    }
  }
}
