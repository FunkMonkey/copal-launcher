const gulp = require( 'gulp' );
const sourcemaps = require( 'gulp-sourcemaps' );
const babel = require( 'gulp-babel' );

function watchTask( task ) {
	const watcher = gulp.watch( [task.SRC_GLOB], task);
  watcher.on( 'add', path => { console.log('File ' + path + ' was added, running tasks...'); });
  watcher.on( 'change', path => { console.log('File ' + path + ' was changed, running tasks...'); });
}

// ========================= COMMON =========================
function buildScripts( src, dest ) {
  return gulp.src( src, { cwd: __dirname } )
    .pipe( sourcemaps.init() )
    .pipe(
      babel( {
        presets: [ '@babel/react', [ '@babel/preset-env', { 'targets': { 'node': '6.10' } }] ]
      } ) )
    .pipe( sourcemaps.write( '.' ) )
    .pipe( gulp.dest( dest, { cwd: __dirname } ) );
}

// ========================= MAIN =========================
const MAIN_SCRIPTS_SRC_GLOB =  './src/main/**/*.js';
const MAIN_SCRIPTS_DEST = './build/main';

const buildMainScripts = () => buildScripts( MAIN_SCRIPTS_SRC_GLOB, MAIN_SCRIPTS_DEST );

buildMainScripts.displayName = 'build:main:scripts';
buildMainScripts.SRC_GLOB = MAIN_SCRIPTS_SRC_GLOB;

// ========================= RENDERER =========================

// ------------------------- Scripts -------------------------

const RENDERER_SCRIPTS_SRC_GLOB =  './src/renderer/scripts/**/*.js';
const RENDERER_SCRIPTS_DEST = './build/renderer/scripts';

const buildRendererScripts = () => buildScripts( RENDERER_SCRIPTS_SRC_GLOB, RENDERER_SCRIPTS_DEST );

buildRendererScripts.displayName = 'build:renderer:scripts';
buildRendererScripts.SRC_GLOB = RENDERER_SCRIPTS_SRC_GLOB;

// ------------------------- Styles -------------------------
const RENDERER_STYLES_SRC_GLOB = './src/renderer/styles/**/*.css';
const RENDERER_STYLES_DEST = './build/renderer/styles';

const buildRendererStyles = ()  =>
  gulp.src( RENDERER_STYLES_SRC_GLOB, { cwd: __dirname } )
      .pipe( gulp.dest( RENDERER_STYLES_DEST, { cwd: __dirname } ) );

buildRendererStyles.displayName = 'build:renderer:styles';
buildRendererStyles.SRC_GLOB = RENDERER_STYLES_SRC_GLOB;

// ------------------------- Views -------------------------

const RENDERER_VIEWS_SRC_GLOB = './src/renderer/views/**/*.html';
const RENDERER_VIEWS_DEST = './build/renderer/views';

const buildRendererViews = () =>
  gulp.src( RENDERER_VIEWS_SRC_GLOB, { cwd: __dirname } )
      .pipe( gulp.dest( RENDERER_VIEWS_DEST, { cwd: __dirname } ) );

buildRendererViews.displayName = 'build:renderer:views';
buildRendererViews.SRC_GLOB = RENDERER_VIEWS_SRC_GLOB;

// ------------------------- YAML -------------------------

const RENDERER_YAML_SRC_GLOB = './src/renderer/**/*.yaml';
const RENDERER_YAML_DEST = './build/renderer';

const buildRendererYAML = () =>
  gulp.src( RENDERER_YAML_SRC_GLOB, { cwd: __dirname } )
      .pipe( gulp.dest( RENDERER_YAML_DEST, { cwd: __dirname } ) );

buildRendererYAML.displayName = 'build:renderer:yaml';
buildRendererYAML.SRC_GLOB = RENDERER_YAML_SRC_GLOB;

// ========================= ALL =========================
const build = gulp.parallel( [ buildMainScripts, buildRendererScripts,
                               buildRendererStyles, buildRendererViews,
                               buildRendererYAML ] );
build.displayName = 'build';

const watchBuild = () => {
  watchTask( buildMainScripts );
  watchTask( buildRendererScripts );
  watchTask( buildRendererStyles );
  watchTask( buildRendererViews );
  watchTask( buildRendererYAML );
};
watchBuild.displayName = 'watch:build';

// ========================= EXPORTS =========================
module.exports[build.displayName] = build;
module.exports[watchBuild.displayName] = watchBuild;
