import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    protected transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD,
            },
        });
    }

    async sendMail(to: string, subject: string, html: string): Promise<void> {
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to,
            subject,
            html,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendAdminNotification(bcc: string[], subject: string, html: string): Promise<void> {
        const adminMailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: process.env.ADMIN_EMAIL,
            bcc,
            subject,
            html,
        };

        await this.transporter.sendMail(adminMailOptions);
    }
}
