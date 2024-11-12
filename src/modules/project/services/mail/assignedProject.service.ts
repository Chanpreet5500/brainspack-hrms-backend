import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class projectMailService {
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

    async sendAssignedToEmail(to: string, by: string, projectName: string) {
        console.log(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)
        const mailOptions = {
            from: 'Auth-backend service',
            to: to,
            subject: `You are assigned for project ${projectName}`,
            html: `<p>Congratulations, you got choosen for ${projectName} project by ${by}</p>`,
        };
        await this.transporter.sendMail(mailOptions);
    }

    async sendAssignedByEmail(to: string, assignedUsers: string, projectName: string) {

        const mailOptions = {
            from: 'Auth-backend service',
            to: to,
            subject: `${projectName} is assigned`,
            html: `<p>${projectName} has been assigned to ${assignedUsers}</p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }
}