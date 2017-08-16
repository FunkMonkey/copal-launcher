var gulp = require( 'gulp' );
var utils = require( '../utils.js' );

require( './build-main-scripts' );
require( './build-renderer-scripts' );
require( './build-renderer-styles' );
require( './build-renderer-views' );
require( './build-renderer-yaml' );

gulp.task( 'build:main', [ 'build:main:scripts' ] );
gulp.task( 'build:renderer', [ 'build:renderer:scripts',
                               'build:renderer:styles',
                               'build:renderer:views',
                               'build:renderer:yaml' ] );


gulp.task( 'build', [ 'build:main', 'build:renderer' ] );

gulp.task( 'watch:build:main', function ( ) {
  utils.watchTask( 'build:main:scripts' );
} );

gulp.task( 'watch:build:renderer', function ( ) {
  utils.watchTask( 'build:renderer:scripts' );
  utils.watchTask( 'build:renderer:styles' );
  utils.watchTask( 'build:renderer:views' );
  utils.watchTask( 'build:renderer:yaml' );
} );

gulp.task( 'watch:build', [ 'watch:build:main', 'watch:build:renderer' ] );
