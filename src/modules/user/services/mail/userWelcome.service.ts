import { Injectable } from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';

@Injectable()
export class WelcomeUserMailService extends MailService {
    async sendSucessSignEmail(to: string, bcc: string[]): Promise<void> {
        await this.sendMail(
            to,
            'Successful Sign-in',
            `<p>Congratulations, you have successfully signed in to our website</p>`,
        );

        await this.sendAdminNotification(
            bcc,
            'New User Signed In',
            `<p>A new user signed in: ${to}</p>`,
        );
    }
}
