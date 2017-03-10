var gulp = require( 'gulp' );
var babel = require( 'gulp-babel' );

var onError = require( '../utils' ).onError;

// var sourcemaps = require( 'gulp-sourcemaps' );

var SRC_GLOB =  './src/main/**/*.js';

gulp.task( 'build:main:scripts', function() {
  return gulp.src( SRC_GLOB )
            //  .pipe( sourcemaps.init() )
             .pipe( babel( {
                  presets: ['es2015']
              } ) )
             .on( 'error', onError )
            //  .pipe( sourcemaps.write( '.' ) )
             .pipe( gulp.dest( 'build/main' ) );
});

gulp.tasks[ 'build:main:scripts' ].SRC_GLOB = SRC_GLOB;
