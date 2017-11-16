var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize');
var ftp = require('vinyl-ftp');
var gulpDeployFtp = require('gulp-deploy-ftp');
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var mergeStream = require('merge-stream');
var uglifyInline = require('gulp-uglify-inline');
var php = require('gulp-connect-php');

var path = {
	src: { // Исходники
		html: 'src/*.html',
		js: 'src/js/*.js',
		style: 'src/style/**/*.scss',
		css: 'src/style/**/*.css',
		img: {
			all: 'src/img/**/*.*',
			team: 'src/img/team/**/*.*',
			logos: 'src/img/logos/**/*.*',
			documents: 'src/img/documents/**/*.*',
			works: 'src/img/works/**/*.*',
			others: 'src/img/*.*'
		},
		php: 'src/php/*.php'
	},
	assets: { // Активы (от других разработчиков)
		html: 'assets/*.html',
		js: 'assets/js/*.js',
		css: 'assets/css/*.css'
	},
	build: { // Сборка
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		all: 'build/**/*.*',
		img: {
			team: 'build/img/team/',
			logos: 'build/img/logos/',
			icons: 'build/img/icons/',
			documents: 'build/img/documents/',
			works: 'build/img/works/',
			others: 'build/img/'
		},
		php: 'build/php/'
	},
	watch: { // watch
		html: 'src/*.html',
		js: 'src/js/*.js',
		php: 'src/php/*.php',
		style: 'src/style/*.scss',
		img: 'src/img/**/*.*'
	},
	clean: './build'
};

var imageminConfig = {
	progressive: true,
	svgoPlugins: [{removeViewBox: false}],
	interlaced: true
};

gulp.task('build-html', function () {
	gulp.src(path.src.html)
		.pipe(plumber())
		.pipe(htmlmin({collapseWhitespace: true}))
        // .pipe(uglifyInline({output: {comments: false}}))
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('build-scss', function () {
    gulp.src(path.src.style)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(uglifycss())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('build-css', function () {
    gulp.src(path.src.css)
        .pipe(plumber())
        .pipe(uglifycss())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('build-js', function () {
	gulp.src(path.src.js)
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('build-php', function () {
	gulp.src(path.src.php)
		.pipe(gulp.dest(path.build.php))
		.pipe(reload({stream: true}));
});

gulp.task('build-img', function () {
	gulp.src(path.src.img.team)
		.pipe(plumber())
		.pipe(imageResize({
			height: 400
		}))
		.pipe(rename(function (path) {
			path.basename += "@2x"
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.team))
		.pipe(reload({stream: true}));

	gulp.src(path.src.img.team)
		.pipe(plumber())
		.pipe(imageResize({
			height: 200
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.team))
		.pipe(reload({stream: true}));

	gulp.src(path.src.img.works)
		.pipe(plumber())
		.pipe(imageResize({
			height: 660
		}))
		.pipe(rename(function (path) {
			path.basename += "@2x"
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.works))
		.pipe(reload({stream: true}));

	gulp.src(path.src.img.works)
		.pipe(plumber())
		.pipe(imageResize({
			height: 330
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.works))
		.pipe(reload({stream: true}));


	gulp.src(path.src.img.documents)
		.pipe(plumber())
		.pipe(imageResize({
			height: 200
		}))
		.pipe(rename(function (path) {
			path.basename += "_thumbnail"
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.documents))
		.pipe(reload({stream: true}));

	gulp.src(path.src.img.documents)
		.pipe(plumber())
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.documents))
		.pipe(reload({stream: true}));


	gulp.src(path.src.img.logos)
		.pipe(plumber())
		.pipe(imageResize({
			height: 200
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.logos))
		.pipe(reload({stream: true}));

	gulp.src(path.src.img.logos)
		.pipe(plumber())
		.pipe(imageResize({
			height: 400
		}))
		.pipe(rename(function (path) {
			path.basename += "@2x"
		}))
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.logos))
		.pipe(reload({stream: true}));

	gulp.src(path.src.img.others)
		.pipe(plumber())
		.pipe(imagemin(imageminConfig))
		.pipe(gulp.dest(path.build.img.others))
		.pipe(reload({stream: true}));

});


var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function (done) {
	realFavicon.generateFavicon({
		masterPicture: 'src/img/fizteh-radio-logo-black.png',
		dest: 'build/img/favicons/',
		iconsPath: '/img/favicons/',
		design: {
			ios: {
				pictureAspect: 'backgroundAndMargin',
				backgroundColor: '#ffffff',
				margin: '14%',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'whiteSilhouette',
				backgroundColor: '#2d89ef',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'shadow',
				themeColor: '#ffffff',
				manifest: {
					display: 'browser',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'silhouette',
				themeColor: '#5bbad5'
			}
		},
		settings: {
			compression: 2,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		versioning: {
			paramName: 'v',
			paramValue: '00rdR7KRp5'
		},
		markupFile: FAVICON_DATA_FILE
	}, function () {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function () {
	return gulp.src('build/index.html')
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest(path.build.html));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function (err) {
		if (err) {
			throw err;
		}
	});
});

gulp.task('build-assets', function () {
	gulp.src(path.assets.html)
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));

	gulp.src(path.assets.js)
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));

	gulp.src(path.assets.css)
		.pipe(uglifycss())
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({stream: true}));
});

gulp.task('php', function() {
	php.server({ base: 'build', port: 8010, keepalive: true});
});

gulp.task('watch', function () {
	gulp.watch([path.watch.html], function (event, cb) {
		gulp.start('build-html');
	});
	gulp.watch([path.watch.style], function (event, cb) {
		gulp.start('build-scss');
	});
    gulp.watch([path.watch.css], function (event, cb) {
        gulp.start('build-css');
    });
	gulp.watch([path.watch.js], function (event, cb) {
		gulp.start('build-js');
	});
	gulp.watch([path.watch.php], function (event, cb) {
		gulp.start('build-php');
	});
	gulp.watch([path.watch.img], function (event, cb) {
		gulp.start('build-img');
	});
});

gulp.task('webserver', function () {
	browserSync({
		proxy: '127.0.0.1:8010',
		// server: {
		// 	baseDir: "./build"
		// },
		tunnel: true,
		host: 'localhost',
		port: 9001,
		logPrefix: "fiztehradio_server"
	});
});

gulp.task('build', [
	'build-html',
	'build-js',
	'build-php',
    'build-scss',
    'build-css',
	'build-img',
	'generate-favicon',
	'inject-favicon-markups',
	'build-assets'
]);

var options = {
	user: "u0309421",
	password: "Kz_hs_9z",
	port: 21,
	host: "potylitcyn.ru",
	uploadPath: "httpdocs/potylitcyn.ru"
};

gulp.task('default', ['build', 'php', 'webserver', 'watch']);