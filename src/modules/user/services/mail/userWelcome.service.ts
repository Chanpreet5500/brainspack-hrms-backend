import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WelcomeUserMailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            // port: 587,
            port: 465,
            // secure: false,
            secure: true,
            auth: {
                user: process.env.ADMIN_EMAIL,
                pass: process.env.ADMIN_PASSWORD,

            },
        });
    }

    async sendSucessSignEmail(to: string) {
        const mailOptions = {
            from: 'harmeet.axionic@gmail.com',
            to: to,
            subject: 'Successfull Sign-in',
            html: `<p>Congratulations, you are successfully sign-in to our website</p>`,
        };

        const adminMailOptions = {
            from: 'harmeet.axionic@gmail.com',
            to: process.env.ADMIN_EMAIL,
            subject: 'New User Signed In',
            html: `<p>A new user signed in ${to} </p>`,
        };

        await this.transporter.sendMail(adminMailOptions)
        await this.transporter.sendMail(mailOptions);
    }
}