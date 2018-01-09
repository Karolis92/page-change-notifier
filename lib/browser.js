const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

module.exports = class Browser {
    async initialize() {
        const chrome = await chromeLauncher.launch({
            chromeFlags: [
                //'--disable-gpu',
                //'--headless'
            ]
        });
        const protocol = await CDP({
            port: chrome.port
        });
        await Promise.all([protocol.Page.enable(), protocol.Runtime.enable()]);
        this.protocol = protocol;
    }

    navigate(url) {
        return this.protocol.Page.navigate({ url });
    }

    loadEventFired(callback) {
        return this.protocol.Page.loadEventFired(callback);
    }

    reload(callback) {
        return this.protocol.Page.reload({ ignoreCache: true });
    }

    async getPageTextContent() {
        const { result } = await this.protocol.Runtime.evaluate({
            expression: "document.querySelector('body').textContent"
        });
        return result.value;
    }

    async captureScreenshot() {
        const { data } = await this.protocol.Page.captureScreenshot();
        return data;
    }
}