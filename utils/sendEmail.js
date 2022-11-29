const nodemailer = require('nodemailer')
const emailConfig = require('./emailConfig')

const sendEmail = async({to,subject,html}) => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport(emailConfig);

    return transporter.sendMail({
        from: '"Bostigger" <bostigger@stiggers.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
    });
}

module.exports = sendEmail