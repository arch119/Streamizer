
/*
** This file contains logic slightly modified from the sample code in
** https://developers.google.com/gmail/api/quickstart/nodejs
*/

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


var SCOPES, TOKEN_DIR, TOKEN_PATH;

exports.initGoogleApi = function(workingDir, clientSecret){
    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/gmail-nodejs-quickstart.json
    SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send' ];
    TOKEN_DIR =  workingDir + '/.credentials/';
    TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';
    debugger;
    return new Promise(function(resolve, reject){
        fs.readFile(clientSecret, function processClientSecrets(err, content) {
                if (err) {
                    console.log('Error loading client secret file: ' + err);
                    reject(err);
                }
                // Authorize a client with the loaded credentials, then call the
                // Gmail API.
                authorize(JSON.parse(content), (auth)=>{
                    resolve(auth);
                });
            });
    });    
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
exports.listLabels = function(auth) {
  var gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}

function Gmail(auth){
  this.gmail = google.gmail({
        version: 'v1',
        auth: auth
    });
}

Gmail.prototype.sendMail = function(headers_obj, message){
    var email = '';

    for(var header in headers_obj)
        email += header += ": "+headers_obj[header]+"\r\n";
        email += "\r\n" + message;

        var base64encoded = new Buffer(email).toString('base64');
        var sendRequest = this.gmail.users.messages.send({
          'userId': 'me',
          'resource': {
            'raw': base64encoded.replace(/\+/g, '-').replace(/\//g, '_')
          }
        });
}

exports.Gmail = Gmail;