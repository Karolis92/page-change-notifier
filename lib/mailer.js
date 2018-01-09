const nodemailer = require('nodemailer');

module.exports = class Mailer {
    constructor(config) {
        this.checkConfig(config);
        this.transport = nodemailer.createTransport(config.smtp);
        this.from = config.from;
        this.to = config.to;
    }

    checkConfig(config) {
        if (!config.smtp) throw Error("'mail.smtp' is not defined");
        if (!config.from) throw Error("'mail.from' is not defined");
        if (!config.to) throw Error("'mail.to' is not defined");
    }

    sendMail(subject, html, attachments) {
        var message = {
            from: this.from,
            to: this.to,
            subject: `[page-change-notifier] ${subject}`,
            html,
            attachments

        };
        this.transport.sendMail(message, (error) => {
            if (error) {
                console.log('Error occurred while sending email...', error);
            }
        });
    }
}