import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserResignMailService {
    private transporter: nodemailer.Transporter;

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

    async sendResignSubmit(to: string) {
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: to,
            subject: 'Resign Submission',
            html: `<p>Your resign is submitted successfully</p>`,
        };
        await this.transporter.sendMail(mailOptions);
    }
    async sendResignToAdmin(to: string, from: string) {
        const adminMailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: to,
            subject: 'New Resign is Submitted',
            html: `<p> ${from}  submitted a resign</p>`,
        };

        await this.transporter.sendMail(adminMailOptions)

    }
}