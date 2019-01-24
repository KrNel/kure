# KURE

## A Community Platform and Curation Network Remedy for Steem

KURE provides a network hub for people to create their own community groups for evaluating content to curate. It will also develop into communities to create posts within.

You can create your own communities and have others join to contribute. You make up your own criteria. You manage who can add curation links to your community group. Anyone else can follow your community and engage.

My goal is to make content easier for everyone to find by all of us sharing the content we like trough communities. Others can find communities they are interested in and see what is being curated within that community to also support it with upvotes, resteems and comments.


----
**Development set to HTTPS.**

To revert to HTTP only:

---
In `start-server.js`:
- replace `https.createServer(httpsOptions, app)` with just `app`.

---
In `client/package.json`:
- remove `set HTTPS=true&&` from `start`.

---
In `client/package.json`:
- remove "s" from "https" in `"proxy": "https://127.0.0.1:3001/"`
