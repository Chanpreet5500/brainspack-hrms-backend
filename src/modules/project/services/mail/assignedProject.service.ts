import { Injectable } from '@nestjs/common';
import { MailService } from 'src/services/mail/mail.service';

@Injectable()
export class ProjectMailService extends MailService {

    async sendAssignedToEmail(bcc: string[], by: string, projectName: string): Promise<void> {
        const subject = `You are assigned to project: ${projectName}`;
        const html = `<p>Congratulations, you have been chosen for the project <strong>${projectName}</strong> by <strong>${by}</strong>.</p>`;
        await this.sendAdminNotification(bcc, subject, html);
    }

    async sendAssignedByEmail(to: string, projectName: string, assignedUsers: string[]): Promise<void> {
        const subject = `${projectName} is assigned`;
        const html = `<p>The project <strong>${projectName}</strong> has been assigned to <strong>${assignedUsers.toString()}</strong>.</p>`;
        await this.sendMail(to, subject, html)
    }

    async sendUpdateEmail(bcc: string[], by: string, projectName: string): Promise<void> {
        const subject = `Project: ${projectName} details Updated`;
        const html = `<p><strong>${projectName}</strong> details are updated by <strong>${by}</strong>.</p>`;
        await this.sendAdminNotification(bcc, subject, html);
    }

    async sendUpdatetoAssignedBy(to: string, by: string, projectName: string): Promise<void> {
        const subject = `${projectName} is Updated`;
        const html = `<p>The project <strong>${projectName}</strong> has been updated by <strong>${by}</strong>.</p>`;
        await this.sendMail(to, subject, html)
    }

}
