import nodemailer from "nodemailer";



const sendEmail = async ({ to, cc = process.env.DEFAULT_CC_EMAIL || '', subject, html, attachements = [] }) => {






    // create transporter
    const transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }

        }
    )

    // sending email
    const info = transporter.sendMail(
        {
            from: `"${process.env.EMAIL_FROM_NAME || 'Sarahah'}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to,
            cc,
            subject,
            html,
            attachements,
        }
    )
    return info;



}

import { EventEmitter } from "node:events";
export const emitter = new EventEmitter();


emitter.on('sendEmail', async(args) => {
    try {
        await sendEmail(args);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error in sending email", error);
        
    }

})