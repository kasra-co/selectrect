'use strict';

var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var watchify = require( 'watchify' );
var browserify = require( 'browserify' );
var source = require( 'vinyl-source-stream' );
var buffer = require( 'vinyl-buffer' );
var sourcemaps = require( 'gulp-sourcemaps' );
var uglify = require( 'gulp-uglify' );
var sass = require( 'gulp-sass' );
var _ = require( 'lodash' );

gulp.task( 'watch', [ 'html', 'sass' ], function() {
	gulp.watch( 'src/**/*.scss', [ 'sass' ]);
	gulp.watch( 'src/index.html', [ 'html' ]);
	bundle();
});

gulp.task( 'html', function() {
	gulp.src( 'src/index.html' )
	.pipe( gulp.dest( 'dist' ));
});

gulp.task( 'sass', function() {
	gulp.src( 'src/index.scss' )
	.pipe( sass() )
	.pipe( gulp.dest( 'dist' ));
});

// Watchify helps Browserify to only rebuild the parts of a source tree that are affected by a change, to reduce build time.
// See https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
var bundler = watchify( browserify(
	'./src/index.js',
	_.extend(
		watchify.args,
		{ debug: true }
	)
));

bundler.transform( 'reactify' );

bundler.on( 'update', bundle ); // On any dependency update, run the bundler
bundler.on( 'log', gutil.log ); // Help bundler log to the terminal

function bundle() {
	return bundler.bundle()
	.on( 'error', gutil.log.bind( gutil, 'Browserify error' )) // Log errors during build
	.pipe( source( 'index.min.js' ))
	.pipe( gulp.dest( './dist' ));
}
