# 🤖 Echobot: A Simple Bot Example for Slack

This is a Slack slash command demo that simply echoes a message.

Sure, this bot is not quite practical use-case, however this tells you how to:

1. Set up your app (this doc)
2. Distribution (OAuth to install) -> See [oauth.md](https://glitch.com/edit/#!/slack-echobot-oauth?path=oauth.md)

---

## 👩‍💻 1. Setting up & Developing an App in Your Workspace


### 🆕 Creating a New Slack App

Go to [**Your Apps**](https://api.slack.com/apps) and click the **Create New App**, then enter your app name and choose which workspace you want to install to develop. (*Note: The beta preview is shown in this screenshot below.*)

![create app](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fcreate_slack_app.png?1506976337446)

Then click **Create App**

### 🗝 Getting Your Credentials

First, you need to get your own app credentials (Client ID, client secret, and verification token) at Settings > [**Basic information**](https://api.slack.com/apps/general), scroll down a bit, and find your credentias.

![App credentials](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fcredentials.png?1506986469638)

The credential info is stored in the `.env` file. 🗝
```
SLACK_CLIENT_ID=[enter your client ID]
SLACK_CLIENT_SECRET=[enter your client secret]
SLACK_VERIFICATION_TOKEN=[enter your verification token]
SLACK_AUTH_TOKEN=[will obtain the auth token later]
```

(Rename the `.env-test ` in this repo to `.env`, and fill it out with your credentials!)


### ⚙️ Setting up Slash Command

This example bot uses the [**Slash Command**](https://api.slack.com/slash-commands). On the Setting > **Add features and functionalities**, choose Slash Commands.

![add slash commands feature](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fadd_features.png?1507574515165)

Then click **Create New Command** button and fill out the info:

![create new command](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fcreate_new_command.png?1507575729024)

Click **Save** (and click it whenever you make changes!)

### 🔏 OAuth Scopes

Go to Features > [**OAuth & Permissions**](https://api.slack.com/apps/oauth) where you will need to select permission scopes of the features the bot uses.

Since the bot uses uses `users.info` method to obtain a user's name, so the scopes we need here are: `users:read`, as well as `commands`, which should be pre-selected.

![scopes](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fscopes.png?1507580188516)

### 🔐 Access Token (for your Dev Workspace Only)

Once you set them up, scrollup on the page, and click **Install App to Workspace**, then authorize the app to your test workspace.

Once you install the bot, you should get OAuth tokens, in this case, *OAuth Access Token* (`xoxp-`).

![OAuth token](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fxoxp_token.png?1507580424424)

The `xoxb-` token also goes to your `.env` file. This token is required to make API calls, when you are developing your app in your testing workspace.

🐥 *When you distribute this bot, you will need to authenticate each user to obtain a new token for each workspace to be installed. You will work on it in the next step, explained in [oauth.md](oauth.md).*

## 💻 Developing Your Slash Command

This example (`index.js`) uses Node.js with Express to develop the slash command.

The `app.post('/echo'...)` is where the slash command is build. Basically, when a user (you, in this case) calls the command from a Slack client, the `/echo` is requested via POST.

Additionally, the app calls the Slack's `users.info` API to obtain the user's registered full name to be displayed.



### 🏅 Testing your Slash Command

Now, test the bot on the Slack workspace you just installed it to.

Type something followed by `/echo`. The bot will echo you when you start your message:

![echobot](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fecho_slash.png?1507583430097)


You can finish right here, to keep this app as an internalk integration for your workspace only, or go ahead and make it installble on any workspaces!


## 📦 Distribute it!!!

Now, you are ready to [distribute your bot](oauth.md)!
