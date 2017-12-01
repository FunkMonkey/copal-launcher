import cn from 'classnames';
import keycode from 'keycode';
import R from 'ramda';
import React from 'react';
import Rx from 'rxjs/Rx';

import createReactiveComponent from '../utils/create-reactive-component';
import AutoBoundSubject from '../utils/rx/auto-bound-subject';

function getDatumKey( datum, index ) {
  if ( typeof datum === 'string' )
    return index;

  return datum.id || index;
}

function getDatumTitle( datum ) {
  if ( typeof datum === 'string' )
    return datum;

  return datum.title;
}

function definition( sources ) {
  const data$ = sources.data$.startWith( [] ).share();

  const onKeyDown$ = new AutoBoundSubject();
  const onDownArrow$ = onKeyDown$.filter( e => keycode( e ) === 'down' );
  const onUpArrow$ = onKeyDown$.filter( e => keycode( e ) === 'up' );
  const onEnter$ = onKeyDown$.filter( e => keycode( e ) === 'enter' );

  const changeSelectedIndexBy$ = Rx.Observable.merge( onDownArrow$.map( () => 1 ),
                                                      onUpArrow$.map( () => -1 ) );

  const _selectedItemInfo$ = new Rx.Subject();
  const selectedItemInfo$ = _selectedItemInfo$.startWith( null ).shareReplay( 1 );

  // TODO: use previously selected item?
  // const lastSelectedItemInfo$ = selectedItemInfo$.filter( info => info !== null );

  const selectedItemInfoFromData$ = data$
    .withLatestFrom( selectedItemInfo$,
      ( data, selectedItemInfo ) => {
        if ( !selectedItemInfo )
          return null;

        const index = R.findIndex( item => item === selectedItemInfo.item, data );

        if ( index === -1 )
          return null;

        return { index, item: selectedItemInfo.item, numItems: data.length };
      } );

  const selectedIndexFromChange$ = changeSelectedIndexBy$
    .withLatestFrom( selectedItemInfo$, ( change, selectedItemInfo ) => {
      if ( selectedItemInfo === null )
        return 0;

      const currIndex = selectedItemInfo.index;
      const numItems = selectedItemInfo.numItems;

      const nextIndex = currIndex + change;
      if ( change < 0 ) {
        return ( nextIndex >= 0 ) ? nextIndex : numItems + nextIndex;
      }
      return ( nextIndex < numItems ) ? nextIndex : nextIndex - numItems;
    } );

  const selectIndexRequests$ = Rx.Observable.merge( selectedIndexFromChange$,
                                                    sources.selectIndex$ || Rx.Observable.empty() );

  const selectedItemInfoFromRequest$ = selectIndexRequests$.withLatestFrom( data$,
    ( index, data ) => {
      if ( data[index] )
        return { index, item: data[index], numItems: data.length };
      return null;
    } );

  // TODO: handle subscription
  Rx.Observable.merge( selectedItemInfoFromData$, selectedItemInfoFromRequest$ )
    .distinctUntilChanged()
    .subscribe( _selectedItemInfo$ );

  const chosenListItem$ = onEnter$.withLatestFrom( selectedItemInfo$,
    ( evt, selectedItemInfo ) => selectedItemInfo.item );

  // using Observable.create for focus subscription
  const dom$ = Rx.Observable.create( observer => {
    let domNode = null;

    const domSubscription = Rx.Observable.combineLatest( data$, selectedItemInfo$,
      ( data, selectedItemInfo ) => {
        const listItems = data.map( ( d, i ) => (
          <div
            className={cn( 'list-item', { 'is-selected': i === ( selectedItemInfo ? selectedItemInfo.index : -1 ) } )}
            key={getDatumKey( d, i )}
          >
            {getDatumTitle( d )}
          </div> ) );

        return (
          <div
            className="copal-list-view"
            role="presentation"
            ref={node => { domNode = node; }}
            tabIndex="0"
            onKeyDown={onKeyDown$.next}
            // onClick={actions.listener( 'onClick' )}
          >
            {listItems}
          </div>
        );
      } )
      .subscribe( observer );

    const focus$ = sources.focus$ ? sources.focus$.do( () => domNode && domNode.focus() ) : Rx.Observable.of( '' );
    const focusSubscription = focus$.subscribe( () => {} );
    return () => {
      domSubscription.unsubscribe();
      focusSubscription.unsubscribe();
    };
  } );

  return { view: dom$, chosenListItem$ };
}

export default createReactiveComponent( {
  displayName: 'ListView',
  definition
} );
