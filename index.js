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

/* /echo Slash command
{ token: '4OkeSO5aydrbTHdoerLxgk0U',
  team_id: 'T0JFD6M53',
  team_domain: 'slack-hackers',
  channel_id: 'C5TS6D8CC',
  channel_name: 'tomomi',
  user_id: 'U5R3PALPN',
  user_name: 'girlie_mac',
  command: '/echo',
  text: 'hello',
  response_url: 'https://hooks.slack.com/commands/T0JFD6M53/254774836999/bAH0YDbFEBExzFIPnAbJfP39',
  trigger_id: '253688129522.18523225173.2f2c12016c25d34d7fb41274a835171b' }
  */

  /* user.info

  {"ok":true,"user":{"id":"U5R3PALPN","team_id":"T0JFD6M53","name":"girlie_mac","deleted":false,"color":"ea2977","real_name":"Tomomi Imura","tz":"America\/Los_Angeles","tz_label":"Pacific Daylight Time","tz_offset":-25200,"profile":{"avatar_hash":"c54bc5873072","real_name":"Tomomi Imura","display_name":"girlie_mac","image_24":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_24.jpg","image_32":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_32.jpg","image_48":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_48.jpg","image_72":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_72.jpg","image_192":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_192.jpg","image_512":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_512.jpg","image_1024":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_1024.jpg","image_original":"https:\/\/avatars.slack-edge.com\/2017-09-19\/243725254002_c54bc58730721b49b0d6_original.jpg","first_name":"Tomomi","last_name":"Imura","status_emoji":":zzz:","real_name_normalized":"Tomomi Imura","display_name_normalized":"girlie_mac","team":"T0JFD6M53"},"is_admin":false,"is_owner":false,"is_primary_owner":false,"is_restricted":false,"is_ultra_restricted":false,"is_bot":false,"updated":1507583389,"is_app_user":false,"has_2fa":false}}

  */
