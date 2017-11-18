const gulp = require( "gulp" );
const babel = require( "gulp-babel" );

const onError = require( "../utils" ).onError;

// const sourcemaps = require( "gulp-sourcemaps" );

const SRC_GLOB =  "./src/main/**/*.js";

gulp.task( "build:main:scripts", function() {
  return gulp.src( SRC_GLOB )
    //  .pipe( sourcemaps.init() )
    .pipe(
      babel( {
        presets: [[
          '@babel/preset-env',
          { "targets": { "node": "6.10" } }
        ]]
      } ) )
    .on( "error", onError )
    //  .pipe( sourcemaps.write( "." ) )
    .pipe( gulp.dest( "build" ) );
});

gulp.tasks[ "build:main:scripts" ].SRC_GLOB = SRC_GLOB;
