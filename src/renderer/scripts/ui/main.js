import React from 'react';
import Rx from 'rx';

import * as Cyclic from '../utils/cyclic';
import Input from './input';
import ListView from './list-view';

export default Cyclic.component( 'Main', model => {
  const launcher = model.launcher;

  const input = Cyclic.instance( Input, { value$: launcher.input.to$,
                                          focus$: launcher.input.focus$ } );
  input.getEvent( 'value$' ).subscribe( launcher.input.from$ );
  const inputOnUserExit$ = input.getEvent( 'onUserExit$' ).share();

  const selectIndex$ = Rx.Observable.merge( launcher.listview.selectIndex$,
                                            inputOnUserExit$.map( () => 0 ) );
  const listView = Cyclic.instance( ListView, { data$: launcher.output$,
                                                selectIndex$,
                                                focus$: inputOnUserExit$ } );

  listView.getEvent( 'chosenListItem$' ).subscribe( launcher.listview.chosen$ );

  return Rx.Observable.just(
    <div className="copal-main">
      <div className="copal-main-settings-button">...</div>

      <div className="copal-main-top-row copal-dark-box">
        <button className="copal-main-command">NAME</button>
        {input}
      </div>

      <div className="copal-main-resultbox copal-dark-box">
        {listView}
      </div>
    </div>
   );
} );
