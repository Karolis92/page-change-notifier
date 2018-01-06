### ABOUT

Simple Node.js app, that scans webpage every N milliseconds and sends email if change was detected.
It compares just response text, no dynamically loaded content will be compared.

Args:
```
-u    url of page to scan
-i    interval to scan page at in milliseconds (defaults to 300000 (5 min))
-s    smtp connection url with user details
-f    from:
-t    to:
```

### USAGE EXAMPLE

```
node start.js -u http://www.google.com -i 2000 -s smtps://user%40gmail.com:pass@smtp.gmail.com -f user@gmail.com -t touser@gmail.com
```