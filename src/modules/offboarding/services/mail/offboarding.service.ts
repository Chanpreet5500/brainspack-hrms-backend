import { Injectable } from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';


@Injectable()
export class OffboardingMailService extends MailService {
    async sendSuccessOffboarding(to: string, bcc: string[]): Promise<void> {
        await this.sendMail(
            to,
            'Offboarding is Complete',
            `<p>Congratulations, your offboarding is completed successfully</p>`,
        );

        await this.sendAdminNotification(
            bcc,
            'Offboarding is Complete',
            `<p>Offboarding is completed by ${to}</p>`,
        );
    }
}
