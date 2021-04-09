const config = require('./config.json');
const fs = require('fs');
const archiver = require('archiver');
const os = require('os');
const open = require('mac-open');

const myBannerName = process.argv[2];
const myBannerFormat = process.argv[3];

/**
 * Init archive
 */
function main() {

    if(parseArgs(process.argv)) {

        var paths = setPaths(myBannerName, myBannerFormat);

        if(process.argv[3] === 'all') {

            batchArchive(myBannerName, config.banners.formats);

        } else {

            var meta = getMeta(paths);
            new BannerArchive(paths, meta, myBannerFormat);
        }

        open(paths.finder.dest, { a: "Finder" }, function(error) {
            console.log(error)
        });

	} else {
    	console.log('Aborting...');
	}
}

/**
 *
 * @param args
 * @return {boolean}
 */
function parseArgs(args) {

	if(typeof args !== 'undefined' && args.length > 3) {
		console.log('Arguments provided');
		return true;
	}
	console.log('Invalid or missing arguments');
	return false;
}

/**
 *
 * @param {String} name Banner name
 * @param {String} format Banner format
 * @return {{html: {src: string, dest: string}, json: {src: string, dest: string}, image: {src: string}, default: {src: string, dest: string}, zip: {dest: string}, finder: {dest: string}}}
 */
function setPaths(name, format) {

    // init paths
    var paths = {
        html: {
            src: 'build/'+ name + '/b-' + name + '--' + format + '.html',
            dest: 'index.html'
        },
        json: {
            src: 'build/' + name + '/' + name + '.json',
            dest: name + '.json'
        },
        image: {
            src: 'build/' + name + '/'
        },
        default: {
            src: 'build/' + name + '/' + name + '--' + format + '.jpg',
            dest: name + '--' + format + '.jpg'
        },
        zip: {
            dest: os.homedir() + '/Downloads/' + name +  '-' + format + '.zip'
        },
        finder: {
            dest: os.homedir() + '/Downloads/'
        }
    };

    return paths;
}

/**
 *
 * @param {String} type
 * @param {Array} formats
 */
function batchArchive(type, formats) {

    var batch = new Array(formats.length);

    for(var i=0; i < formats.length; i++) {
        var paths = setPaths(type, formats[i]);
        var meta = getMeta(paths);
        batch[i] = new BannerArchive(paths, meta, formats[i]);
    }
}

/**
 *
 * @param paths
 * @return {naming|{category, content_type, additional}}
 */
function getMeta(paths) {

    var filename = paths.json.src;
    var json = JSON.parse(fs.readFileSync(filename));
    console.log(json.data.naming);
    return json.data.naming;
}

/**
 *
 * @param {Object} paths
 * @param meta
 * @param format
 * @constructor
 */
function BannerArchive(paths, meta, format) {
    this.images = config.banners.images;
    this.paths = paths;
    this.meta = meta;
    this.format = format;

    this.paths.zip.dest = os.homedir() +
        '/Downloads/' +
        '[' + this.meta.category + ']' +
        '[' + this.meta.content_type + ']' +
        '[' + this.meta.additional + ']' +
        '[d-' + this.format + '].zip';

    this.output = new fs.createWriteStream(this.paths.zip.dest);
    this.archive = new archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    this.output.on('end', function() {
        console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    this.archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.log(err);
        } else {
            throw err;
        }
    });

    // good practice to catch this error explicitly
    this.archive.on('error', function(err) {
        throw err;
    });

    // pipe archive data to the file
    this.archive.pipe(this.output);

    for (var i = 0; i < this.images.length; ++i) {
        this.archive.file(this.paths.image.src + this.images[i] + '.jpg', { name: this.images[i] + '.jpg' });
    }

    this.archive.file(this.paths.json.src, { name: this.paths.json.dest });
    this.archive.file(this.paths.html.src, { name: this.paths.html.dest });
    this.archive.file(this.paths.default.src, { name: this.paths.default.dest });

    this.archive.finalize();

}

main();
