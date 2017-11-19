import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';
import createDesktopDrivers from '@copal/drivers-desktop';
import CopalCore from '@copal/core';
import getBasicOperators from './basic-operators';
import yaml from 'js-yaml';
import AutoBoundSubject from './utils/rx/auto-bound-subject';

// import * as Cyclic from './utils/cyclic';
import Main from './ui/main';

function createLauncher() {
  const drivers = createDesktopDrivers( {
    profile: {
      // TODO: read from command-line or localStorage or something
      dir: path.join( __dirname, '..', '..', '..', '..', '..', '..', 'profile' ),
      fs
    } }
  );
  const core = new CopalCore( drivers );

  // TODO: make asynchronous
  const basicGraphs = yaml.safeLoad( fs.readFileSync( path.join( __dirname, 'basic-graphs.yaml' ), 'utf8' ) );

  return {
    currCommand: null,

    nameText$: new Rx.Subject(),

    input: {
      from$: new Rx.Subject(),
      to$: new Rx.Subject(),
      focus$: new Rx.Subject()
    },

    output$: new AutoBoundSubject(),
    outputError$: new AutoBoundSubject(),

    listview: {
      chosen$: new Rx.Subject(),
      selectIndex$: new Rx.Subject()
    },

    core,
    init() {
      return core.init()
        .do( null, null, () => {
          core.addOperators( getBasicOperators( this ) );
          core.addGraphTemplates( basicGraphs );
          console.log( 'Finished core initialization' );

          ReactDOM.render( <Main launcher={this} />, document.querySelector( '.copal-content' ) );
          console.log( 'Finished render initialization' );
        } );
    },

    resetUI() {
      this.input.focus$.next();
      this.input.to$.next( '' );
      this.listview.selectIndex$.next( -1 );
    },

    executeCommandGraph( commandName ) {
      if ( this.currCommand )
        core.disposeCommandGraph( this.currCommand );

      this.resetUI();

      // do this in the next tick, so errors from executeCommand are not
      // forwarded to the previously disposed command
      setTimeout( () => {
        this.currCommand = core.executeCommandGraph( commandName );
        this.nameText$.next( commandName );
      }, 0 );
    }
  };
}

// eslint-disable-next-line import/prefer-default-export
export function init() {
  const launcher = createLauncher();
  launcher.init()
    .subscribe( () => {}, null, () => { launcher.executeCommandGraph( 'commands' ); } );
}
