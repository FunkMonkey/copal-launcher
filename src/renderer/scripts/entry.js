import React from 'react';
import ReactDOM from 'react-dom';
import Launcher from './launcher';
import Main from './ui/main';

// eslint-disable-next-line import/prefer-default-export
export function init() {

  // TODO: extract core from Launcher, turn Launcher into plugin and wait here for
  // core.init( pluginInfos ).withLatestFrom( core.plugins.waitFor( '@copal/launcher/controller' ))

  const launcher = new Launcher();
  // TODO: find out, why error gets eaten here
  launcher.init()
    .subscribe( () => {}, err => { console.error( err ); }, () => {
      ReactDOM.render( <Main launcher={launcher} />, document.querySelector( '.copal-content' ) );
      console.log( 'Finished render initialization' );
      launcher.instantiateCommand( 'commands' );
    } );
}
