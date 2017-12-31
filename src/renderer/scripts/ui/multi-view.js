import React from 'react';
import { Observable } from 'rxjs';

import createReactiveComponent from '../utils/create-reactive-component';

function definition( { controller } ) {
  const viewsToInsert$ = controller.viewsToInsert$
    .scan( ( acc, view ) => { acc.push( view ); return acc; }, [] );

  const view$ = Observable.combineLatest( viewsToInsert$, controller.currentView$.startWith( 'listview' ),
    ( viewsToInsert, currentView ) => {
      const views = viewsToInsert.map( view => (
        <div key={view.name} className={( currentView === view.name ) ? view.name : `${view.name} hidden_`}>
          {view.component}
        </div> ) );
      return <div className="multi-view">{views}</div>;
    } );

  return { view$ };
}

export default createReactiveComponent( {
  displayName: 'MultiView',
  definition
} );
