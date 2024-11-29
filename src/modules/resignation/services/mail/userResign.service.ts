import { Injectable } from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';


@Injectable()
export class UserResignMailService extends MailService {
    async sendResignSubmit(to: string): Promise<void> {
        await this.sendMail(
            to,
            'Resign Submission',
            `<p>Your resignation has been submitted successfully</p>`,
        );
    }

    async sendResignApproved(to: string): Promise<void> {
        await this.sendMail(
            to,
            'Resignation Approved',
            `<p>Your resignation has been approved successfully</p>`,
        );
    }

    async sendResignDeclined(to: string): Promise<void> {
        await this.sendMail(
            to,
            'Resignation Declined',
            `<p>Your resignation has been declined</p>`,
        );
    }

    async sendResignToAdmin(from: string, bcc: string[]): Promise<void> {
        await this.sendAdminNotification(
            bcc,
            'New Resignation Submitted',
            `<p>${from} has submitted a resignation</p>`,
        );
    }
}
