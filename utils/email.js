const config = require('config')
const nodemailer = require('nodemailer')
const pug = require('pug')
const htmlToText = require('html-to-text')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email,
        this.from = "alex <alex@mail.io>"
        this.url = url,
        this.firstname = user.name.split(' ')[0]
    }

    newTransport() {
        return nodemailer.createTransport({
            host: config.get('EmailHost'),
            port: config.get('EmailPort'),
            auth: {
                user: config.get('EmailUser'),
                pass: config.get('EmailPass')
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
            text: htmlToText.fromString(html)
        }

        await this.newTransport().sendMail(mailOptions)
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome, you just signed up to the best footware store. Discover the best kicks at Footville')
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your Password reset token(valid for only 10 minutes')
    }
}
