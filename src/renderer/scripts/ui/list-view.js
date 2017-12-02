import cn from 'classnames';
import keycode from 'keycode';
import R from 'ramda';
import React from 'react';
import { Observable, Subject } from 'rxjs';

import createReactiveComponent from '../utils/create-reactive-component';
import bindObserver from '../utils/rx/bind-observer';

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

  const onKeyDown$ = bindObserver( new Subject() );
  const onDownArrow$ = onKeyDown$.filter( e => keycode( e ) === 'down' );
  const onUpArrow$ = onKeyDown$.filter( e => keycode( e ) === 'up' );
  const onEnter$ = onKeyDown$.filter( e => keycode( e ) === 'enter' );

  const changeSelectedIndexBy$ = Observable.merge( onDownArrow$.map( () => 1 ),
                                                      onUpArrow$.map( () => -1 ) );

  const _selectedItemInfo$ = new Subject();
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

  const selectIndexRequests$ = Observable.merge( selectedIndexFromChange$,
                                                    sources.selectIndex$ || Observable.empty() );

  const selectedItemInfoFromRequest$ = selectIndexRequests$.withLatestFrom( data$,
    ( index, data ) => {
      if ( data[index] )
        return { index, item: data[index], numItems: data.length };
      return null;
    } );

  // TODO: handle subscription
  Observable.merge( selectedItemInfoFromData$, selectedItemInfoFromRequest$ )
    .distinctUntilChanged()
    .subscribe( _selectedItemInfo$ );

  const chosenListItem$ = onEnter$.withLatestFrom( selectedItemInfo$,
    ( evt, selectedItemInfo ) => selectedItemInfo.item );

  // using Observable.create for focus subscription
  const dom$ = Observable.create( observer => {
    let domNode = null;

    const domSubscription = Observable.combineLatest( data$, selectedItemInfo$,
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

    const focus$ = sources.focus$ ? sources.focus$.do( () => domNode && domNode.focus() ) : Observable.of( '' );
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
