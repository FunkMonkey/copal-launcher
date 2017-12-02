import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { Subject } from 'rxjs';
import { loaders } from 'reactive-plugin-system';
import Core from '@copal/core';
import getBasicOperators from './basic-operators';
import AutoBoundSubject from './utils/rx/auto-bound-subject';

export default class Launcher {
  constructor() {
    const coreOptions = {
      profile: {
        // TODO: read from command-line or localStorage or something
        directory: path.join( __dirname, '..', '..', '..', '..', '..', '..', 'profile' ),
        fs
      },
      getPluginFactory: loaders.require
    };

    this.core = new Core( coreOptions );

    this.currCommand = null;
    this.nameText$ = new Subject();

    this.input = {
      from$: new Subject(),
      to$: new Subject(),
      focus$: new Subject()
    };

    this.output$ = new AutoBoundSubject();
    this.outputError$ = new AutoBoundSubject();

    this.listview = {
      chosen$: new Subject(),
      selectIndex$: new Subject()
    };
  }

  init() {
    // TODO: make asynchronous
    const basicComponents = yaml.safeLoad( fs.readFileSync( path.join( __dirname, 'basic-graphs.yaml' ), 'utf8' ) );
    return this.core.init()
      .do( null, null, () => {
        this.core.commands.connector.addOperators( getBasicOperators( this ) );
        this.core.commands.templates.addComponents( basicComponents );
        console.log( 'Finished core initialization' );
      } );
  }

  resetUI() {
    this.input.focus$.next();
    this.input.to$.next( '' );
    this.listview.selectIndex$.next( -1 );
  }

  instantiateCommand( commandName ) {
    if ( this.currCommand )
      this.core.commands.destroy( this.currCommand );

    this.resetUI();

    // do this in the next tick, so errors from executeCommand are not
    // forwarded to the previously disposed command
    setTimeout( () => {
      this.currCommand = this.core.commands.instantiate( commandName );
      this.nameText$.next( commandName );
    }, 0 );
  }
}
