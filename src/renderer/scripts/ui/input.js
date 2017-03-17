import keycode from 'keycode';
import React from 'react';
import Rx from 'rx';

import * as Cyclic from '../utils/cyclic';

export default Cyclic.component( 'CopalInput', ( model, actions ) => {
  const value$ = actions.get( 'onChange' )
    .map( ev => ev.target.value );

  const onKeyDown$ = actions.get( 'onInputKeyDown' );
  const onUserExit$ = onKeyDown$.filter( e => keycode( e ) === 'down' );

  let domNode = null;

  const dom$ = Rx.Observable.merge( value$, model.value$ )
    .distinctUntilChanged()
    .map( value =>
      <input
        autoFocus
        ref={node => { domNode = node; }}
        type="edit"
        className="copal-main-input"
        value={value}
        onChange={actions.listener( 'onChange' )}
        onKeyDown={actions.listener( 'onInputKeyDown' )}
      />
    );

  const focus$ = model.focus$ ? model.focus$.do( () => domNode && domNode.focus() ) :
                                Rx.Observable.empty();


  return {
    dom$: Rx.Observable.merge( dom$, focus$.ignoreElements() ),
    value$,
    onUserExit$
  };
} );
