const gulp = require( 'gulp' );
const babel = require( 'gulp-babel' );
const sourcemaps = require( 'gulp-sourcemaps' );

const onError = require( '../utils' ).onError;

const SRC_GLOB =  './src/renderer/scripts/**/*.js';

gulp.task( 'build:renderer:scripts', function() {
  return gulp.src( SRC_GLOB )
    .pipe( sourcemaps.init() )
    .pipe( babel( {
        presets: [
          '@babel/react',
          [ '@babel/preset-env',
            { "targets": { "node": "6.10" } }
          ]
        ]
    } ) )
    .on( 'error', onError )
    .pipe( sourcemaps.write( '.' ) )
    .pipe( gulp.dest( 'build/renderer/scripts' ) );
});

gulp.tasks[ 'build:renderer:scripts' ].SRC_GLOB = SRC_GLOB;
