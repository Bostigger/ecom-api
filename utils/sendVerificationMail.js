const sendEmail = require ("./sendEmail");

const sendVerificationMail = async ({name, email, verificationToken, origin}) => {
     origin = `${origin}/verify-email?token=${verificationToken}&email=${email}`
    const message = `<h4>Hello, ${name}</h4><p>Please confirm your email. <a href="${origin}">Click here</a></p>`

  return sendEmail({to:email,subject:"Email Confirmation",html:message})
}

module.exports = sendVerificationMail