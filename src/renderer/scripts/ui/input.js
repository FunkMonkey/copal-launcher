import keycode from 'keycode';
import React from 'react';
import { empty, merge, Subject } from 'rxjs';
import { distinctUntilChanged, filter, ignoreElements, map, tap } from 'rxjs/operators';

import createReactiveComponent from '../utils/create-reactive-component';
import bindObserver from '../utils/rx/bind-observer';

function definition( sources ) {
  const onChange$ = bindObserver( new Subject() );
  const value$ = onChange$.pipe( map( ev => ev.target.value ) );

  const onKeyDown$ = bindObserver( new Subject() );
  const onUserExit$ = onKeyDown$.pipe( map( filter( e => keycode( e ) === 'down' ) ) );

  let domNode = null;

  const dom$ = merge( value$, sources.value$ ).pipe(
    distinctUntilChanged(),
    map( value => (
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        ref={node => { domNode = node; }}
        type="edit"
        className="copal-main-input"
        value={value}
        onChange={onChange$.next}
        onKeyDown={onKeyDown$.next}
      /> ) )
  );

  const focus$ = sources.focus$
    ? sources.focus$.pipe( tap( () => domNode && domNode.focus() ) )
    : empty();


  return {
    view: merge( dom$, focus$.pipe( ignoreElements() ) ),
    outValue$: value$,
    onUserExit$
  };
}

export default createReactiveComponent( {
  displayName: 'CopalInput',
  definition,
  directSources: true,
  sourceNames: ['focus$', 'value$'],
  sinkNames: ['outValue$', 'onUserExit$']
} );
