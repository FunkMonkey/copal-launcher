import cn from 'classnames';
import keycode from 'keycode';
import R from 'ramda';
import React from 'react';
import Rx from 'rx';

import * as Cyclic from '../utils/cyclic';

export default Cyclic.component( 'ListView', ( model, actions ) => {
  const data$ = model.data$.startWith( [] ).share();

  const onKeyDown$ = actions.get( 'onKeyDown' );
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
                                                    model.selectIndex$ || Rx.Observable.empty() );

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
        const listItems = data.map( ( d, i ) =>
          <div
            className={cn( 'list-item', { 'is-selected': i === ( selectedItemInfo ? selectedItemInfo.index : -1 ) } )}
            key={d}
          >{d}</div> );

        return (
          <div
            className="copal-list-view"
            ref={node => { domNode = node; }}
            tabIndex="0"
            onKeyDown={actions.listener( 'onKeyDown' )}
            // onClick={actions.listener( 'onClick' )}
          >
            {listItems}
          </div>
        );
      } )
      .subscribe( observer );

    const focus$ = model.focus$ ? model.focus$.do( () => domNode && domNode.focus() ) : Rx.Observable.just( '' );
    const focusSubscription = focus$.subscribe( () => {} );
    return () => {
      domSubscription.dispose();
      focusSubscription.dispose();
    };
  } );

  return { dom$, chosenListItem$ };
} );
