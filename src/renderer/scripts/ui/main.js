import React from 'react';
import { of, ReplaySubject } from 'rxjs';
import { switchAll } from 'rxjs/operators';

import createReactiveComponent from '../utils/create-reactive-component';

import CommandButton from './command-button';
import Input from './input';
import MultiView from './multi-view';

function definition( { launcher } ) {
  const inputOutValue$ = new ReplaySubject( 1 );
  inputOutValue$.pipe( switchAll() ).subscribe( launcher.input.from$ );

  const onUserExitSub$ = new ReplaySubject( 1 );
  // const onUserExit$ = onUserExitSub$.switch().share();

  // const selectIndex$ = Observable.merge( launcher.getView( 'listview' ).selectIndex$,
  //                                        onUserExit$.map( () => 0 ) );
  // const chosenListItem$ = new ReplaySubject( 1 );
  // // TODO: handle subscription
  // chosenListItem$.switch().subscribe( launcher.getView( 'listview' ).chosen$ );

  return {
    view: of(
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
          <MultiView controller={launcher._resultViewController} />
        </div>
      </div>
    )
  };
}

// <ListView
//   data$={launcher.getView( 'listview' ).data$}
//   selectIndex$={selectIndex$}
//   focus$={onUserExit$}
//   chosenListItem$={chosenListItem$}
// />

export default createReactiveComponent( {
  displayName: 'Main',
  definition,
  directSources: true,
  sourceNames: [ 'launcher' ],
  sinkNames: []
} );
