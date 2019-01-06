import React from 'react';
import { map, startWith } from 'rxjs/operators';
import createReactiveComponent from '../utils/create-reactive-component';

function definition( { text$ } ) {
  const view$ = text$.pipe(
    startWith( '' ),
    map( text => <button className="copal-main-command">{text}</button> )
  );

  return { view$ };
}

export default createReactiveComponent( {
  displayName: 'CopalInput',
  definition
} );
