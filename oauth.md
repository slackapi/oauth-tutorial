# 📦 2. Distributing Your App


Once you finish developing and testing your Slack app (internal integration) in your own dev workspace, now it is time to make it installable and distribute.

To distribute your app (on Slack App Directory or elsewhere), you must use Slack OAuth to authenticate a user and her workspace (where the app will be installed).


## Using Slack OAuth

These steps are the typical Slack OAuth workflow when a user (admin of a workspace) tried to install your app to her workspace.

### Authorization

First, your app requests an authorization from a user using a button on your web site:

![Slack OAuth flow 1](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fslack_oauth_user.gif?1508272842039)

Clicking the HTML button initiates a GET request to the URL, `https://slack.com/oauth/authorize` with the parameters (`client_id` and `scopes` also some other [optional params](https://api.slack.com/docs/oauth) that needed for the app.  

#### Scopes

In this sample app, you only need the permission scopes for `commands` and `users:read`, however, if you are willing to access more APIs that requires other permissions, you have to attach them here too.

You can find out which scopes yoy need at the API pages. For instance, if you want to use the [`pins.add`](https://api.slack.com/methods/pins.add) method, you can find the required scope at the top-right side under **Expected scopes**.


![scopes](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fscopes.png?1509041940214)

Once the request is granted, Slack sends you a temporary `code`, which you will need to exchange it to a more permanent token. The code expires 10 minutes after issuance.

### Token Issuing

If all is well, exchange the authorization code for an access token using the `oauth.access` API method.

![Slack OAuth flow 2](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fslack_oauth_grant.gif?1508272838919)

### Calling Slack APIs

Now you have more permanent token for this user's workspace (as well as any other users' workspace tokens!), so that you can use the token to call any other methods, such as `user.info` for your app!

![Slack OAuth flow 3](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fslack_oauth_token.gif?1508272835813)


### Reviewing Your OAuth Flow

Let' recap everything you have learned in a single GIF animation:

1. Your app requests an authorization from a user with a button
2. Once granted, your app receives a temporary `code`
3. Call the `oauth.access` method with the code
4. Exchange the code to a more permanent token
5. Use the token to make API calls
6. Slack server gives your app responses

![Slack OAuth flow](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fslack_oauth.gif?1508261030604)


## 🔐 Setting up the Slack OAuth Button

Now let's implement the OAuth for your app.



### 🗺 Setting up OAuth Redirect URL

Go to Settings > **Manage Distribution**.

Scroll down to **Add OAuth Redirect URLs** and enter a URL. This is a place to be redirected after the authentication from your OAuth is done:

![redirect](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Foauth_redirect.png?1507314535480)

Click **Save URLs**.

In this Node.js demo, the redirect URL is `.../auth`, which is actually the he `app.get('/auth')` route in the `index.js`.

This is where you need to obtain a temporary `code`, then use the code to get an auth token to access Slack APIs:

```javascript
app.get('/auth', function(req, res){
  if (!req.query.code) { // access denied
    return;
  }
  var data = {form: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code
  }};
  request.post('https://slack.com/api/oauth.access', data, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // Get an auth token
      let oauthToken = JSON.parse(body).access_token;
      // OAuth done- redirect the user to wherever
      res.redirect(__dirname + "/public/success.html");
    }
  })
});
```

### 🌐 Adding a Slack OAuth Button to your Website

Then scroll up to the embeddable button section and copy the button HTML snippet. (Refresh the page if you don't see after adding a redirect URL):

![oauth button](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Foauth_button.png?1507244339743)

Paste the HTML code in your web page (in this Glitch example, see `index.html`):

```html
<a href="https://slack.com/oauth/authorize?&client_id=18523225173.254487109014&scope=commands,users:read">
  <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
</a>
```
Make sure if the `href` URL is passing all the permission scopes you need. (In this case, we need `commands` and `users:read`). If you have not set the scopes correctly, your app is not going to work.

Once a user authenticates with the button, Slack will redirect back to your specified `redirect_uri` (either the one you specified in the dashboard, or passed as a query string with the button href) with a temporary code. You will need to use the code to obtain an `access_token`.

### Tokens

When you were developing and testing your internal integration on your own test workspace, you had your workspace Slack auth token (`-xoxb`) hardcoded. With OAuth, now you will use an issued token per each workspace to call Web APIs.

## Activate Public Distribution

Now go back to your dashboard and check the checkbox under **Remove Hard Coded Information** under "Manage Distribution", click the **Activate Public Distribution** button.

![Distribute](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fdistribution_ok.png?1507244344076)

Now your app should be installable at any workspaces!

Go to the HTML page with the button and authenticate and install the bot to a workspace:

![web](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fweb_button.png?1507587055591)

![install](https://cdn.glitch.com/2ec8b3de-9650-4eab-b71f-62c01b006901%2Fslack_oauth.png?1507586335453)

Try the EchoBot by typing the slash command, `/echo`. It should work!

If something goes wrong, the first thing I would suspect is the permission scopes are not set correctly with your OAuth button, you should should check.
