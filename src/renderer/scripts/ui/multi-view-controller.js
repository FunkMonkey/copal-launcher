import R from 'ramda';
import React from 'react';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export default class MultiViewController {
  constructor() {
    this.viewFactories = {};
    this.views = {};
    this.viewsCurrentlyInserting = {};
    this.viewsToInsert$ = new ReplaySubject();
    this.currentView$ = new ReplaySubject( 1 );
    this.currentView = null;
  }

  addViewFactory( name, factory ) {
    this.viewFactories[ name ] = factory;
  }

  getViewFactory( name ) {
    return this.viewFactories[ name ];
  }

  setCurrentView( name ) {
    this.currentView = name;
    this.currentView$.next( name );
  }

  getView( name ) {
    if ( this.views[name] )
      return Observable.of( this.views[name] );

    return this.insertView( name );
  }

  insertView( name ) {
    const isAlreadyInserting = name in this.viewsCurrentlyInserting;

    const view = isAlreadyInserting
      ? this.viewsCurrentlyInserting[name]
      : this.instantiateView( name, this.getViewFactory( name ) );

    // wait for mounting
    const resultView$ = Observable.concat( view.sinks.componentDidMount$, Observable.of( view ) );

    if ( isAlreadyInserting )
      return resultView$;

    this.viewsCurrentlyInserting[ name ] = view;
    this.viewsToInsert$.next( view );

    return resultView$.do( () => {
      delete this.viewsCurrentlyInserting[name];
      this.views[name] = view;
    } );
  }

  // eslint-disable-next-line class-methods-use-this
  instantiateView( name, viewFactory ) {
    const view = viewFactory();
    view.name = name;
    return view;
  }
}
