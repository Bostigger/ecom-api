const sendEmail = require("./sendEmail");
const sendResetPasswordLink = ({name, email, passwordToken, origin}) => {
    origin = `${origin}/reset-password?token=${passwordToken}&email=${email}`
    const message = `<h4>Hello, ${name}</h4><p>Please follow this link to reset your password >> . <a href="${origin}">Click here</a></p>`

    return sendEmail({to:email,subject:"Password Reset",html:message})
}

module.exports = sendResetPasswordLink