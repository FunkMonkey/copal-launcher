import React from 'react';
import { combineLatest } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';

import createReactiveComponent from '../utils/create-reactive-component';

function definition( { controller } ) {
  const viewsToInsert$ = controller.viewsToInsert$.pipe(
    scan( ( acc, view ) => { acc.push( view ); return acc; }, [] )
  );

  const startView$ = controller.currentView$.pipe( startWith( 'listview' ) );

  const view$ = combineLatest( viewsToInsert$, startView$ ).pipe(
    map( ( [viewsToInsert, currentView] ) => {
      const views = viewsToInsert.map( view => (
        <div key={view.name} className={( currentView === view.name ) ? view.name : `${view.name} hidden_`}>
          {view.component}
        </div>
      ) );
      return <div className="multi-view">{views}</div>;
    } )
  );

  return { view$ };
}

export default createReactiveComponent( {
  displayName: 'MultiView',
  definition,
  directSources: true,
  sourceNames: ['controller'],
  sinkNames: []
} );
