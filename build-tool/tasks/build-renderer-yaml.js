var gulp = require( 'gulp' );

var SRC_GLOB = './src/renderer/**/*.yaml';

gulp.task( 'build:renderer:yaml', function () {
    return gulp.src( SRC_GLOB )
               .pipe( gulp.dest( './build/renderer/' ) );
  } );

gulp.tasks[ 'build:renderer:yaml' ].SRC_GLOB = SRC_GLOB;
