const properties = require("properties");
const Browser = require('./browser.js');
const Mailer = require('./mailer.js');

module.exports = class PageChangeNotifier {
    run() {
        properties.parse("app.config", { path: true, namespaces: true }, async (error, config) => {
            if (error) {
                throw Error('Error while reading config file' + error);
            }

            this.checkConfig(config);
            this.scan = config.scan;

            this.mailer = new Mailer(config.mail);
            this.mailer.sendMail('Test SMTP', 'Testing if SMTP is configured correctly');

            this.browser = new Browser();
            await this.browser.initialize();

            this.doScan();
        });
    }

    checkConfig(config) {
        if (!config.scan.url) throw Error("'scan.url' is not defined");
        if (!config.scan.interval) throw Error("'scan.interval' is not defined");
        if (!config.scan.wait) throw Error("'scan.wait' is not defined");
        if (config.scan.interval <= config.scan.wait)
            throw Error("wait for page to load property must not be greater than interval to reload page");
    }

    doScan() {
        this.browser.navigate(this.scan.url);
        this.browser.loadEventFired(() => {
            setTimeout(() => this.compareContentAndNotify(), this.scan.wait * 1000);
        });
        setInterval(() => this.browser.reload(), this.scan.interval * 1000);
    }

    async compareContentAndNotify() {
        console.log(`${new Date().toTimeString()}: tic`);
        const currentContent = await this.browser.getPageTextContent();
        if (this.previuosContent && this.previuosContent !== currentContent) {
            await this.notify();
        }
        this.previuosContent = currentContent;
    }

    async notify() {
        console.log("Change detected! Sending email.");

        const subject = "Page change detected!";
        const html = `<p>Change detected at <a href="${this.scan.url}">${this.scan.url}</a></p>` +
            '<p><img width="100%" src="cid:screenshotAttachemnt"/></p>';
        const attachments = [
            {
                filename: 'screenshot.png',
                content: Buffer.from(await this.browser.captureScreenshot(), 'base64'),
                cid: 'screenshotAttachemnt'
            }
        ]
        this.mailer.sendMail(subject, html, attachments);
    }
}