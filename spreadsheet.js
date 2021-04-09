/**
 * Utility to create a OAuth connection to Google Sheet API and retrieve sheets data in a JSON array.
 * Authentification is based on the official Quickstart guidelines:
 * https://developers.google.com/sheets/api/quickstart/nodejs
 */

const config = require('./config.json');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const sheets = google.sheets('v4');
const clientSecret = 'client_secret.json';
const paths = {
    json: {
        src: '.tmp/data/',
        dest: 'source/data/'
    }
};

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var tokenDir = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var tokenPath = tokenDir + 'sheets.googleapis.com-nodejs-quickstart.json';
var infoConfMissing = 'Client secret file missing. Please visit https://console.cloud.google.com/apis/dashboard?project=online-banners&organizationId=685331740784';

/**
 * Load client secrets from a local file.
 */
function main() {

    if (!fs.existsSync(clientSecret)) {
        throw infoConfMissing;
    }

    fs.readFile(clientSecret, function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            throw err;
        }

        for(var i=0; i<config.sheets.tabs.length; i++) {
            // Authorize a client with the loaded credentials, select tab then call the
            // Google Sheets API.
            authorize(JSON.parse(content), config.sheets.tabs[i], config.sheets.range, getData);
        }
    });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {String} range The range in the Google Sheet
 * @param {String} tab The Google Sheets tab name you want to retrieve.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, tab, range, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(tokenPath, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client, tab, range);
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
        scope: scopes
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
        fs.mkdirSync(tokenDir);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(tokenPath, JSON.stringify(token));
    console.log('Token stored to ' + tokenPath);
}

/**
 * Get Google Sheet data from a defined tab and its cell range
 *
 * @param auth
 * @param tab
 * @param range
 */
function getData(auth, tab, range) {

    var options = {
        auth: auth,
        spreadsheetId: config.sheets.id,
        range: tab + range,
        majorDimension: 'ROW'
    };

    sheets.spreadsheets.values.get(options, function(err, response, data) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var rows = response.values;
        if (rows.length === 0) {
            console.log('No data found.');
        } else {
            saveData(rows, tab);
        }
    });
}

/**
 * Save JSON data in a given filename and path
 *
 * @param {Object} data Contains data retrieved by the Google Sheet
 * @param {String} filename Defines the filename of the saved JSON
 */
function saveData(data, filename) {
    try {
        fs.mkdirSync(paths.json.src);
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
    fs.writeFileSync(paths.json.src + filename + '.json', JSON.stringify(data, null, 2));
    console.log('Data stored into ' + paths.json.src + filename);
}

main();