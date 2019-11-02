### ABOUT

Simple Node.js app, that scans text in webpage every N milliseconds and sends email with screenshot if change was detected.

Warning: code executes 'body.textContent' to get text for comparison, so it will have hidden text in it and will not detect image and small layout changes etc.

All configurable properties are at app.config

To start app execute:
```
node start.js
```
