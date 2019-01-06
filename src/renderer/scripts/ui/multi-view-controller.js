import React from 'react';
import { concat, of, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
      return of( this.views[name] );

    return this.insertView( name );
  }

  insertView( name ) {
    const isAlreadyInserting = name in this.viewsCurrentlyInserting;

    const view = isAlreadyInserting
      ? this.viewsCurrentlyInserting[name]
      : this.instantiateView( name, this.getViewFactory( name ) );

    // wait for mounting
    const resultView$ = concat( view.sinks.componentDidMount$, of( view ) );

    if ( isAlreadyInserting )
      return resultView$;

    this.viewsCurrentlyInserting[ name ] = view;
    this.viewsToInsert$.next( view );

    return resultView$.pipe(
      tap( () => {
        delete this.viewsCurrentlyInserting[name];
        this.views[name] = view;
      } )
    );
  }

  // eslint-disable-next-line class-methods-use-this
  instantiateView( name, viewFactory ) {
    const view = viewFactory();
    view.name = name;
    return view;
  }
}
