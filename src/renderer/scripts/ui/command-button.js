import React from 'react';
import createReactiveComponent from '../utils/create-reactive-component';

function definition( { text$ } ) {
  const view$ = text$
    .startWith( '' )
    .map( text => <button className="copal-main-command">{text}</button> );

  return { view$ };
}

export default createReactiveComponent( {
  displayName: 'CopalInput',
  definition
} );
