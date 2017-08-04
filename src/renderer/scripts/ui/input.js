import keycode from 'keycode';
import React from 'react';
import Rx from 'rxjs/Rx';

import createReactiveComponent from '../utils/create-reactive-component';
import AutoBoundSubject from '../utils/rx/auto-bound-subject';

function definition( sources ) {
  const onChange$ = new AutoBoundSubject();
  const value$ = onChange$
    .map( ev => ev.target.value );

  const onKeyDown$ = new AutoBoundSubject();
  const onUserExit$ = onKeyDown$.filter( e => keycode( e ) === 'down' );

  let domNode = null;

  const dom$ = Rx.Observable.merge( value$, sources.value$ )
    .distinctUntilChanged()
    .map( value => (
      <input
        autoFocus
        ref={node => { domNode = node; }}
        type="edit"
        className="copal-main-input"
        value={value}
        onChange={onChange$.next}
        onKeyDown={onKeyDown$.next}
      /> )
    );

  const focus$ = sources.focus$ ? sources.focus$.do( () => domNode && domNode.focus() ) :
    Rx.Observable.empty();


  return {
    view: Rx.Observable.merge( dom$, focus$.ignoreElements() ),
    outValue$: value$,
    onUserExit$
  };
}

export default createReactiveComponent( {
  displayName: 'CopalInput',
  definition
} );
