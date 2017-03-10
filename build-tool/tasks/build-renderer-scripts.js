var gulp = require( 'gulp' );
var babel = require( 'gulp-babel' );

var onError = require( '../utils' ).onError;

// var sourcemaps = require( 'gulp-sourcemaps' );

var SRC_GLOB =  './src/renderer/scripts/**/*.js';

gulp.task( 'build:renderer:scripts', function() {
  return gulp.src( SRC_GLOB )
            //  .pipe( sourcemaps.init() )
             .pipe( babel( {
                  presets: ['es2015']
              } ) )
             .on( 'error', onError )
            //  .pipe( sourcemaps.write( '.' ) )
             .pipe( gulp.dest( 'build/renderer/scripts' ) );
});

gulp.tasks[ 'build:renderer:scripts' ].SRC_GLOB = SRC_GLOB;
