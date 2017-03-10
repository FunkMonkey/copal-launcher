var gulp = require( 'gulp' );

var SRC_GLOB = './src/renderer/styles/**/*.css';

gulp.task( 'build:renderer:styles', function () {
    return gulp.src( SRC_GLOB )
               .pipe( gulp.dest( './build/renderer/styles' ) );
  } );

gulp.tasks[ 'build:renderer:styles' ].SRC_GLOB = SRC_GLOB;
