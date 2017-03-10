var gulp = require( 'gulp' );

var SRC_GLOB = './src/renderer/views/**/*.html';

gulp.task( 'build:renderer:views', function () {
    return gulp.src( SRC_GLOB )
               .pipe( gulp.dest( './build/renderer/views' ) );
  } );

gulp.tasks[ 'build:renderer:views' ].SRC_GLOB = SRC_GLOB;
