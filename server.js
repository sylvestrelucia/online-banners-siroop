const config = require('./config.json');
const http = require('http');
const cmd = require('node-cmd');
const portscanner = require('portscanner');

const ecstatic = require('ecstatic')({
    root: __dirname + '/build',
    showDir: true,
    autoIndex: true,
    showDotfiles: false,
    cache: 'max-age=0',
    mimeType: {
        'application/json': ['json']
    }
});

const portStart = config.server.port;
const portEnd = portStart + 100;

/**
 * Init server
 */
function main() {
	startServer()
}

/**
 * Start server on available port starting at port 8000
 */
function startServer() {
	portscanner.findAPortNotInUse(portStart, portEnd, '127.0.0.1', function(error, port) {
		if(error) {
			console.log(error)
		} else {
			console.log('Port available at: ' + port);
			http.createServer(ecstatic).listen(port);

			cmd.get('open http://localhost:' + port, function(err) {
				if (err) {
					console.log('error', err)
				} else {
					console.log('Listening on : ' + port);
				}
			});
		}
	});
}

main();

