import React from 'react';
import Rx from 'rxjs/Rx';

import createReactiveComponent from '../utils/create-reactive-component';

// import * as Cyclic from '../utils/cyclic';
import Input from './input';
import ListView from './list-view';

// const Test = createReactiveComponent( {
//   displayName: 'Test',
//   definition( sources ) {
//     return {
//       view: sources.name$.map( val => <h1>Hello {val}</h1> ),
//       event$: Rx.Observable.interval( 5000 ).map( val => 'Foo ' + val )
//     };
//   }
// } );

// class Listing extends React.Component {
//   render() {
//     return <div>{this.props.hello}</div>;
//   }
// }

function definition( { launcher } ) {
  // return Rx.Observable.just( <Listing hello="foo" /> ).tap( x => console.log(x) );

  const inputOutValue$ = new Rx.ReplaySubject( 1 );
  inputOutValue$.switchMap( x => x ).subscribe( launcher.input.from$ );

  const onUserExitSub$ = new Rx.ReplaySubject( 1 );
  const onUserExit$ = onUserExitSub$.switchMap( x => x ).share();

  const selectIndex$ = Rx.Observable.merge( launcher.listview.selectIndex$,
                                            onUserExit$.map( () => 0 ) );
  const chosenListItem$ = new Rx.ReplaySubject( 1 );
  // TODO: handle subscription
  chosenListItem$.switchMap( x => x ).subscribe( launcher.listview.chosen$ );

  return {
    view: Rx.Observable.of(
      <div className="copal-main">
        <div className="copal-main-settings-button">...</div>

        <div className="copal-main-top-row copal-dark-box">
          <button className="copal-main-command">NAME</button>
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
    ) };
}

export default createReactiveComponent( {
  displayName: 'Main',
  definition
} );
