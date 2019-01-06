import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
// import R from 'ramda';
// import React from 'react';
import { Subject } from 'rxjs';
import { factoryLoaders } from 'reactive-plugin-system';
import Core from '@copal/core';
import getBasicOperators from './basic-operators';
// import bindObserver from './utils/rx/bind-observer';
import MultiViewController from './ui/multi-view-controller';
import ListviewFactory from './ui/viewfactories/listview';
import { tapOnComplete } from './utils/rx/tap-on-complete';

export default class Launcher {
  constructor() {
    const coreOptions = {
      profile: {
        // TODO: read from command-line or localStorage or something
        directory: path.join( __dirname, '..', '..', '..', '..', '..', '..', 'profile' ),
        fs
      },
      getPluginFactory: factoryLoaders.require
    };

    this.core = new Core( coreOptions );

    this.currCommand = null;
    this.nameText$ = new Subject();

    this._resultViewController = new MultiViewController();
    this.addViewFactory( 'listview', ListviewFactory );

    this.input = {
      from$: new Subject(),
      to$: new Subject(),
      focus$: new Subject()
    };

    // this.output$ = bindObserver( new Subject() );
    // this.outputError$ = bindObserver( new Subject() );

    // this.addView( 'listview', {
    //   data$: bindObserver( new Subject() ),
    //   chosen$: new Subject(),
    //   selectIndex$: new Subject()
    // } );
  }

  init() {
    // TODO: make asynchronous
    const basicComponents = yaml.safeLoad( fs.readFileSync( path.join( __dirname, 'basic-graphs.yaml' ), 'utf8' ) );
    return this.core.init().pipe(
      tapOnComplete( () => {
        this.core.commands.connector.addOperators( getBasicOperators( this ) );
        this.core.commands.templates.addComponents( basicComponents );
        console.log( 'Finished core initialization' );
      } )
    );
  }

  addViewFactory( name, factory ) {
    this._resultViewController.addViewFactory( name, factory );
  }

  getResultView( name ) {
    return this._resultViewController.getView( name );
  }

  resetUI() {
    this.input.focus$.next();
    this.input.to$.next( '' );
    // this.getResultView( 'listview' ).selectIndex$.next( -1 );
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
