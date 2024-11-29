import { Injectable } from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';


@Injectable()
export class UserLeaveMailService extends MailService {
    async sendLeaveApplied(to: string): Promise<void> {
        await this.sendMail(
            to,
            'Leave request is submit',
            `<p>Your leave request is submitted</p>`,
        );
    }

    async sendLeaveApproved(to: string): Promise<void> {
        await this.sendMail(
            to,
            'Leave Approved',
            `<p>Your Leave has been approved successfully</p>`,
        );
    }

    async sendLeaveDeclined(to: string): Promise<void> {
        await this.sendMail(
            to,
            'Leave is Declined',
            `<p>Your leave request has been declined</p>`,
        );
    }

    async sendLeaveToAdmin(bcc: string[], from: string,): Promise<void> {
        await this.sendAdminNotification(
            bcc,
            'New Leave request is added',
            `<p>${from} has applied for Leave</p>`,
        );
    }
}
