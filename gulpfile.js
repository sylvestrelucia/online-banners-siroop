const config = 			require('./config.json');
const fs =              require('fs');
const gulp = 			require('gulp');
const inlineCss = 		require('gulp-inline-css');
const htmlMin = 		require('gulp-htmlmin');
const del = 			require('del');
const responsive = 		require('gulp-responsive');
const mustache = 		require("gulp-mustache");
const injectPartials = 	require('gulp-inject-partials');
const rename = 			require('gulp-rename');
const htmlreplace =     require('gulp-html-replace');
const glob =            require("glob");


const dest = 'build';
const tmp = '.tmp';

const paths = {
	files: {
		src: ['source/**/*.jpg', 'source/**/*.json'],
		dest: dest
	},
    css: {
        src: 'source/css/*.css',
        dest: 'build/retargeting'
    },
	json: {
		src: 'source/**/*.json',
		dest: dest
	},
	html: {
		src: 'source/**/*.moustache',
		dest: tmp
	},
    tpl: {
        src: 'source/*/*.mustache',
        dest: '.tmp/templates'
    },
    render: {
        src: '.tmp/templates/*/*.mustache',
        json: 'source/*/*.json',
        dest: '.tmp/templates'
    },
    inline: {
        src: '.tmp/**/*.htm',
        dest: dest
	},
    minified: {
        src: '.tmp/**/*.htm',
        dest: dest
    },
	image: {
		src: '02_Creatives/**/*.jpg',
		dest: 'build'
	}
};


gulp.task('clean', function() {
	return del([dest, tmp]);
});


gulp.task('inject:partials', function() {
    return gulp.src(paths.tpl.src)
        .pipe(injectPartials({
            removeTags: true
        }))
        .pipe(gulp.dest(paths.tpl.dest));
});


gulp.task('render:static', function(done) {

    var a = config.banners.static;

    // loop for rendering each type of banners
    for (var i = 0; i < a.length; i++) {

    	var jsonFile = 'source/' + a[i] + '/' + a[i] + '.json';

        if (fs.existsSync(jsonFile)) {

            gulp.src('.tmp/templates/' + a[i] + '/*.mustache' )
                .pipe(mustache(jsonFile,{},{}))
                .pipe(rename({
                    extname: ".html"
                }))
                .pipe(inlineCss({
                    removeStyleTags: false
                }))
                .pipe(htmlMin({
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    minifyJS: true,
                    removeComments: true
                }))
                .pipe(gulp.dest('build/' + a[i]));
        } else {
            console.log('File does not exist: ' + jsonFile);
        }

    }
    done();
});


gulp.task('render:async', function(done) {

    var a = config.banners.dynamic;

    // loop for rendering each type of banners
    for (var i=0; i<a.length; i++) {

        gulp.src('.tmp/templates/' + a[i] + '/*.mustache')
            .pipe(rename({
                extname: ".html"
            }))
            .pipe(inlineCss({
                removeStyleTags: false
            }))
            .pipe(htmlMin({
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                minifyJS: true
            }))
            .pipe(htmlreplace({
                mustacheStart: '<script id="mustache" type="text/template">',
                mustacheEnd: '</script>'
            }))
            .pipe(gulp.dest('build/' + a[i]));
    }
    done();
});


gulp.task('minify:html', function() {
	return gulp.src(paths.minified.src)
		.pipe(htmlMin({
			collapseWhitespace: true,
			minifyJS: true,
			removeComments: true

		}))
		.pipe(gulp.dest(paths.minified.dest));
});


gulp.task('images:generate', function(done) {

	var a = config.banners.static;

    var ig = paths.image.src;

    var filesFound = glob.sync(ig);

    console.log(filesFound);

	// loop for rendering each type of banners
	for (var i=0; i<filesFound.length; i++) {

        gulp.src(ig)
            .pipe(responsive({
                '**/*.jpg': [{
                    width: 50,
                    height: 50,
                    rename: '50x50.jpg'
                }, {
                    width: 100,
                    height: 100,
                    rename: '100x100.jpg'
                }, {
                    width: 200,
                    height: 200,
                    rename: '200x200.jpg'
                }, {
                    width: 400,
                    height: 400,
                    rename: '400x400.jpg'
                }, {
                    width: 800,
                    height: 800,
                    rename: '800x800.jpg'
                }]
            }, {
                quality: 70,
                progressive: true,
                withMetadata: false
            }))
            .pipe(gulp.dest('build/' + a[i]));
            del(ig);
	}
	done();
});


gulp.task('copy:files', function() {
	return gulp.src(paths.files.src)
		.pipe(gulp.dest(paths.files.dest));
});


gulp.task('copy:css', function() {
    return gulp.src(paths.css.src)
        .pipe(gulp.dest(paths.css.dest));
});


gulp.task('watch', function(){
	gulp.watch(paths.image.src, gulp.series('images:generate'));
});


// TODO: Refactor this task
gulp.task('default', gulp.series('clean', 'images:generate', 'copy:files', 'inject:partials', 'render:static', 'render:async'));


// render static banners, Mustache template server-side rendered
gulp.task('build:static', gulp.series('clean', 'images:generate', 'copy:files', 'inject:partials', 'render:static'));


// render dynamic banners, Mustache template client-side rendered
gulp.task('build:async', gulp.series('clean', 'images:generate', 'copy:files', 'inject:partials', 'render:async'));


// render all banners
gulp.task('build:all', gulp.series('clean', 'images:generate', 'copy:files', 'inject:partials', 'render:static', 'render:async'));


// Update async banners with production settings
gulp.task('publish:async', gulp.series('clean'));
