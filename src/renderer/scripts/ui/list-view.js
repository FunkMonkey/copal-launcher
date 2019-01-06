import cn from 'classnames';
import keycode from 'keycode';
import R from 'ramda';
import React from 'react';
import { combineLatest, empty, merge, Observable, of, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, share, shareReplay, startWith, tap, withLatestFrom } from 'rxjs/operators';

import createReactiveComponent from '../utils/create-reactive-component';
import bindObserver from '../utils/rx/bind-observer';
import log from '../utils/rx/log';

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
  const data$ = sources.data$.pipe( startWith( [] ), share() );

  const onKeyDown$ = bindObserver( new Subject() );
  const onDownArrow$ = onKeyDown$.pipe( filter( e => keycode( e ) === 'down' ) );
  const onUpArrow$ = onKeyDown$.pipe( filter( e => keycode( e ) === 'up' ) );
  const onEnter$ = onKeyDown$.pipe( filter( e => keycode( e ) === 'enter' ) );

  const changeSelectedIndexBy$ = merge( onDownArrow$.pipe( map( () => 1 ) ),
                                        onUpArrow$.pipe( map( () => -1 ) ) );

  const _selectedItemInfo$ = new Subject();
  const selectedItemInfo$ = _selectedItemInfo$.pipe( startWith( null ), shareReplay( 1 ) );

  // TODO: use previously selected item?
  // const lastSelectedItemInfo$ = selectedItemInfo$.filter( info => info !== null );

  const selectedItemInfoFromData$ = data$.pipe(
    withLatestFrom( selectedItemInfo$ ),
    map( ( [data, selectedItemInfo] ) => {
      if ( !selectedItemInfo )
        return null;

      const index = R.findIndex( item => item === selectedItemInfo.item, data );

      if ( index === -1 )
        return null;

      return { index, item: selectedItemInfo.item, numItems: data.length };
    } )
  );

  const selectedIndexFromChange$ = changeSelectedIndexBy$.pipe(
    withLatestFrom( selectedItemInfo$ ),
    map( ( [change, selectedItemInfo] ) => {
      if ( selectedItemInfo === null )
        return 0;

      const currIndex = selectedItemInfo.index;
      const numItems = selectedItemInfo.numItems;

      const nextIndex = currIndex + change;
      if ( change < 0 ) {
        return ( nextIndex >= 0 ) ? nextIndex : numItems + nextIndex;
      }
      return ( nextIndex < numItems ) ? nextIndex : nextIndex - numItems;
    } )
  );

  const selectIndexRequests$ = merge( selectedIndexFromChange$,
                                      sources.selectIndex$ || empty() );

  const selectedItemInfoFromRequest$ = selectIndexRequests$.pipe(
    withLatestFrom( data$ ),
    map( ( [index, data] ) => {
      if ( data[index] )
        return { index, item: data[index], numItems: data.length };
      return null;
    } )
  );

  // TODO: handle subscription
  merge( selectedItemInfoFromData$, selectedItemInfoFromRequest$ )
    .pipe( distinctUntilChanged() )
    .subscribe( _selectedItemInfo$ );

  const chosenListItem$ = onEnter$.pipe(
    withLatestFrom( selectedItemInfo$ ),
    map( ( [, selectedItemInfo] ) => selectedItemInfo.item )
  );

  // using Observable.create for focus subscription
  const dom$ = Observable.create( observer => {
    let domNode = null;

    const domSubscription = combineLatest( data$, selectedItemInfo$ ).pipe(
      map( ( [data, selectedItemInfo] ) => {
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
    ).subscribe( observer );

    const focus$ = sources.focus$
      ? sources.focus$.pipe( tap( () => domNode && domNode.focus() ) )
      : of( '' );
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
