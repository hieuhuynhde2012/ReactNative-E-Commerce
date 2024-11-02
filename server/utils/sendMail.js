const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({ email, html, subject }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.email',
        port: 587,
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.EMAIL_NAME,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: '"digitalworld" <no-reply@digitalworld.com>', // sender address
        to: email,
        subject: subject,
        html: html,
    });

    return info;
});

module.exports = sendMail;
