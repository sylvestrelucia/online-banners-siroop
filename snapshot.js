const config = require('./config.json');
var nrc = require('node-run-cmd');

// Get bash arguments
const myBannerName = process.argv[2];
const myBannerFormat = process.argv[3];

/**
 * Init snapshot
 */
function main() {

	if(process.argv.length < 3) {
		console.log('Name and format parameters missing');
	}

    var dataCallback = function(data) {
        console.log(data)
    };

	if(myBannerFormat === 'all') {

		var batch = [config.banners.formats.length];

		for(var i=0; i<config.banners.formats.length; i++){
			var paths = getPaths(myBannerName, config.banners.formats[i]);
			batch[i] = getCmd(myBannerName, config.banners.formats[i], paths);

			console.log(batch[i]);
		}

		var options = { onError: dataCallback };
		nrc.run(batch, options);

	} else {

		var path = getPaths(myBannerName, myBannerFormat);
		var cmd = getCmd(myBannerName, myBannerFormat, path);

		console.log(cmd);

		nrc.run(cmd, { onError: dataCallback });

	}
}

/**
 *
 * @param name
 * @param format
 * @param paths
 * @return {string}
 */
function getCmd(name, format, paths) {

    // Command to create screenshot for default banner image
return 'electroshot file://' + process.cwd() + '/build/' +
		paths.html.src + ' ' + format + ' --out ' +
		paths.image.src + ' --filename ' + name + '--' + format + '.jpg' +
		' --force-device-scale-factor 1  --quality 30';
}

function getPaths(name, format) {
    return {
		html: {
			src: name + '/b-' + name + '--' + format + '.html'
		},
		image: {
			src: 'build/' + name + '/'
		}
	}
}

main();