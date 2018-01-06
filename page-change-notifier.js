const request = require('request-promise-native');
const nodemailer = require('nodemailer');

module.exports = class PageChangeNotifier {
    constructor(args) {
        this.url = args.u
        this.interval = args.i || 300000;
        this.from = args.f;
        this.to = args.t;
        this.smtp = args.s;

        if (!this.url) throw Error('no url defined (-u)');
        if (!this.from) throw Error('no from defined (-f)');
        if (!this.to) throw Error('no to defined (-t)');
        if (!this.smtp) throw Error('no smtp defined (-s)');
    }

    run() {
        this.mailer = nodemailer.createTransport(this.smtp);
        this.doScan();
    }

    doScan() {
        console.log("tick");
        request(this.url)
            .then((response) => {
                if (this.previousRes && this.previousRes !== response) {
                    this.notify();
                }
                this.previousRes = response;
                setTimeout(() => this.doScan(), this.interval);
            });
    }

    notify() {
        console.log("change detected! Sending email.");
        var message = {
            from: this.from,
            to: this.to,
            subject: "Page change detected!",
            text: `Page change detected in ${this.url} ${response}`
        };
        this.mailer.sendMail(message, (error) => {
            if (error) {
                console.log('Error occurred while sending email...', error);
            }
        });
    }
}