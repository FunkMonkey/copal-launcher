import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rx';
import createDesktopDrivers from '@copal/drivers-desktop';
import CopalCore from '@copal/core';
import getBasicOperators from './basic-operators';
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

  return {
    input$: new Rx.Subject(),
    output$: new Rx.Subject(),
    core,
    init() {
      return core.init()
        .doOnCompleted( () => {
          core.addOperators( getBasicOperators( this ) );
          console.log( 'Finished core initialization' );

          ReactDOM.render(
            <Main launcher={this} />,
            document.querySelector( '.copal-content' )
          );
          console.log( 'Finished render initialization' );
        } )
    }
  };
}

export function init() {
  const launcher = createLauncher();
  launcher.init()
    .subscribe( () => {}, null, () => { launcher.core.executeCommand( 'commands' ); } );
}
