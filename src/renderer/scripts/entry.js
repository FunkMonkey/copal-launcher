import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import React from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';
import { loaders } from 'reactive-plugin-system';
import CopalCore from '@copal/core';
import getBasicOperators from './basic-operators';
import AutoBoundSubject from './utils/rx/auto-bound-subject';

// import * as Cyclic from './utils/cyclic';
import Main from './ui/main';

function createLauncher() {
  const core = new CopalCore( {
    profile: {
      // TODO: read from command-line or localStorage or something
      directory: path.join( __dirname, '..', '..', '..', '..', '..', '..', 'profile' ),
      fs
    },
    getPluginFactory: loaders.require
  } );

  // TODO: make asynchronous
  const basicComponents = yaml.safeLoad( fs.readFileSync( path.join( __dirname, 'basic-graphs.yaml' ), 'utf8' ) );

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
          core.commands.connector.addOperators( getBasicOperators( this ) );
          core.commands.templates.addComponents( basicComponents );
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

    instantiateCommand( commandName ) {
      if ( this.currCommand )
        core.commands.destroy( this.currCommand );

      this.resetUI();

      // do this in the next tick, so errors from executeCommand are not
      // forwarded to the previously disposed command
      setTimeout( () => {
        this.currCommand = core.commands.instantiate( commandName );
        this.nameText$.next( commandName );
      }, 0 );
    }
  };
}

// eslint-disable-next-line import/prefer-default-export
export function init() {
  const launcher = createLauncher();
  // TODO: find out, why error gets eaten here
  launcher.init()
    .subscribe( () => {}, err => { console.error( err ); }, () => { launcher.instantiateCommand( 'commands' ); } );
}
