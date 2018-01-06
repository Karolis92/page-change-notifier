const PageChangeNotifier = require('./page-change-notifier.js');
const args = require('minimist')(process.argv.slice(2));

const pageChangeNotifier = new PageChangeNotifier(args);
pageChangeNotifier.run();