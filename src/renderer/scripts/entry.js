import fs from 'fs';
import path from 'path';
import createDesktopDrivers from '@copal/drivers-desktop';
import CopalCore from '@copal/core';
import getBasicOperators from './basic-operators';


export function init() {
  const drivers = createDesktopDrivers( {
    profile: {
      // TODO: read from command-line or localStorage or something
      dir: path.join( __dirname, '..', '..', '..', '..', '..', '..', 'profile' ),
      fs
    } }
  );
  const core = new CopalCore( drivers );
  core
    .init()
    .doOnCompleted( () => {
      core.addOperators( getBasicOperators() );
      console.log( 'Finished core initialization' );
      core.executeCommand( 'commands' );
    } )
    .subscribe( () => {
      console.log( core.settings );
    } );
}
