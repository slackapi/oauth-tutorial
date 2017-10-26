# Slack OAuth Demo with a Simple Bot

![install](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fslack_oauth.png?1507586335453)


A simple Slack app (slash command) demo that repeats what you say after a command, `/echo`.

Sure, this sounds like a useless demo, but the poupose of this example is to show how to implement an [**OAuth**](https://api.slack.com/docs/oauth) flow to distrubite your app with these steps:

1. Add an [Slack OAuth button](https://api.slack.com/docs/slack-button) on your website
2. GET to authorize with correct `scopes` queries
3. Obtain an Access Token
4. Use the token to call Slack APIs

Try this [**OAuth demo on Glitch**](https://slack-echobot-oauth.glitch.me/)!

---


Cool. First, fork this repo, (or [Remix on Glitch](https://gomix.com/#!/remix/slack-echobot-oauth) if you want to try it on Glitch) to your own repo and get started!

###  1. Developing a Bot

See the step-by-step instructions at:

[**Setting up & Develop in your Dev Workspace**](setup.md) - How to configure the EchoBot and install it on your testing Slack workspace

###  2. Distribute with OAuth

See the step-by-step instructions at:

[**Distibute Your App: How to work with an OAuth Button**](oauth.md) - How to make the app installable to any Slack workspaces with an OAuth button
