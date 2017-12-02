import keycode from 'keycode';
import React from 'react';
import { Observable, Subject } from 'rxjs';

import createReactiveComponent from '../utils/create-reactive-component';
import bindObserver from '../utils/rx/bind-observer';

function definition( sources ) {
  const onChange$ = bindObserver( new Subject() );
  const value$ = onChange$
    .map( ev => ev.target.value );

  const onKeyDown$ = bindObserver( new Subject() );
  const onUserExit$ = onKeyDown$.filter( e => keycode( e ) === 'down' );

  let domNode = null;

  const dom$ = Observable.merge( value$, sources.value$ )
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
    Observable.empty();


  return {
    view: Observable.merge( dom$, focus$.ignoreElements() ),
    outValue$: value$,
    onUserExit$
  };
}

export default createReactiveComponent( {
  displayName: 'CopalInput',
  definition
} );
