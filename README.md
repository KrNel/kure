# kure

Development set for HTTPS. To revert to HTTP only:

---
In "start-server.js", replace "https.createServer(httpsOptions, app)" with just "app".

---
In "client/package.json", remove "set HTTPS=true&&" from "start".

---
In "client/package.json", remove "s" from "https" in "proxy": "https://127.0.0.1:3001/"
