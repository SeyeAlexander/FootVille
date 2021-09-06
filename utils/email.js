const config = require('config')
const nodemailer = require('nodemailer')
const pug = require('pug')
const { htmlToText } = require('html-to-text')

module.exports = class Email {
    constructor(user, url) {
        this.from = `<${config.get('Email_From_Name')}, ${config.get('Email_From_Mail')}>`,
        this.to = user.email,
        this.firstname = user.name.split(' ')[0],
        this.url = url
    }

    newTransport() {
        return nodemailer.createTransport({
            host: config.get('Email_Host'),
            port: config.get('Email_Port'),
            auth: {
                user: config.get('Email_User'),
                pass: config.get('Email_Pass')
            }
        })
    }

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstname: this.firstname,
            url: this.url,
            subject
        })

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        }

        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome. Discover the best kicks at Footville')
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your Password reset token,valid for only 10 minutes')
    }
}
