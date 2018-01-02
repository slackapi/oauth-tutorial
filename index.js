/* *********************************************
 * Echobot: A Simple Bot Example for Slack
 *
 * Tomomi Imura (@girlie_mac)
 * *********************************************/

 /* Slack App setup
  * Slash Command
  * Enable Bot user
  * Scopes: "commands" (slash command) & "users:read" (to get a user's name)
  *
  */

'use strict';

const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

// Internal integration only (No OAuth)
//const oauthToken = process.env.SLACK_AUTH_TOKEN;


// I am using this to store tokens quickly for this demo, but you probably want to use a real DB!
const storage = require('node-persist'); 
storage.initSync();

let apiUrl = 'https://slack.com/api';


/* *******************************
/* Slash Command
/* ***************************** */

app.post('/echo', (req, res) => {
  //console.log(req.body);

  if(req.body.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    // the request is NOT coming from Slack!
    res.sendStatus(401);
    return;
  } else {
    getReply(req.body)
      .then((result) => {
        res.json(result);
      });
  }
});

// User info
const getUserFullname = (team, user) => new Promise((resolve, reject) => {
  let oauthToken = storage.getItemSync(team);
  console.log(oauthToken);
  request.post('https://slack.com/api/users.info', {form: {token: oauthToken, user: user}}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
      return resolve(JSON.parse(body).user.real_name);
    } else {
      return resolve('The user');
    }
  });
});

// Reply in JSON
const getReply = (body) => new Promise((resolve, reject) => {
  let data = {};
  if(body.text) {
    getUserFullname(body.team_id, body.user_id)
      .then((result) => {
        data = {
          response_type: 'in_channel', // public to the channle
          text: result + ' said',
          attachments:[{
            text: body.text
          }]
        };
        return resolve(data);
      })
      .catch(console.error);

  } else { // no query entered
    data = {
      response_type: 'ephemeral', // private message
      text: 'How to use /echo command:',
      attachments:[
      {
        text: 'Type some text after the command, e.g. `/echo hello`',
      }
    ]};
    return resolve(data);
  }
});


/* *******************************
/* OAuth
/* implement when distributing the bot
/* ***************************** */

app.get('/auth', function(req, res){
  if (!req.query.code) { // access denied
    console.log('Access denied');
    return;
  }
  var data = {form: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code
  }};
  request.post(apiUrl + '/oauth.access', data, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      // Get an auth token (and store the team_id / token)
      storage.setItemSync(JSON.parse(body).team_id, JSON.parse(body).access_token);

      res.sendStatus(200);

      // Show a nicer web page or redirect to Slack, instead of just giving 200 in reality!
      //res.redirect(__dirname + "/public/success.html");
    }
  })
});





/* Extra */

app.get('/team/:id', function (req, res) {

  try {
    let id = req.params.id;
    let token = storage.getItemSync(id);

    res.send({
      'team_id': id,
      'token': token
    });

  } catch(e) {
    res.sendStatus(404);
  }

});


