import React from 'react';
import { Observable, ReplaySubject } from 'rxjs';

import createReactiveComponent from '../utils/create-reactive-component';

import CommandButton from './command-button';
import Input from './input';
import ListView from './list-view';

function definition( { launcher } ) {
  const inputOutValue$ = new ReplaySubject( 1 );
  inputOutValue$.switch().subscribe( launcher.input.from$ );

  const onUserExitSub$ = new ReplaySubject( 1 );
  const onUserExit$ = onUserExitSub$.switch().share();

  const selectIndex$ = Observable.merge( launcher.listview.selectIndex$,
                                         onUserExit$.map( () => 0 ) );
  const chosenListItem$ = new ReplaySubject( 1 );
  // TODO: handle subscription
  chosenListItem$.switch().subscribe( launcher.listview.chosen$ );

  return {
    view: Observable.of(
      <div className="copal-main">
        <div className="copal-main-settings-button">...</div>

        <div className="copal-main-top-row copal-dark-box">
          <CommandButton text$={launcher.nameText$} />
          <Input
            value$={launcher.input.to$}
            focus$={launcher.input.focus$}
            outValue$={inputOutValue$}
            onUserExit$={onUserExitSub$}
          />
        </div>

        <div className="copal-main-resultbox copal-dark-box">
          <ListView
            data$={launcher.output$}
            selectIndex$={selectIndex$}
            focus$={onUserExit$}
            chosenListItem$={chosenListItem$}
          />
        </div>
      </div>
    )
  };
}

export default createReactiveComponent( {
  displayName: 'Main',
  definition
} );
