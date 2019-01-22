# KURE

## A Community Platform and Curation Network Remedy for Steem

KURE provides a network hub for people to create their own communities or groups for evaluating content to curate. It will also develop into communities to create posts within.

KURE is where you can go to create your own communities and follow others. You make up your own criteria. You manage who can add posts to your community group. Anyone else can follow your community and engage.

My goal is to make content easier for everyone to find, by all of us sharing the content we like and want others to upvote, through the creation of our own communities.


----
**Development set to HTTPS.**

To revert to HTTP only:

---
In "start-server.js", replace "https.createServer(httpsOptions, app)" with just "app".

---
In "client/package.json", remove "set HTTPS=true&&" from "start".

---
In "client/package.json", remove "s" from "https" in "proxy": "https://127.0.0.1:3001/"
