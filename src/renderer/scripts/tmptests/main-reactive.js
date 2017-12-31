import React from 'react';
import ReactDOM from 'react-dom';
import Rx from 'rxjs/Rx';
import Hello from './hello-reactive';

const greeting$ = Rx.Observable
  .interval( 3000 )
  .map( count => ( count % 2 === 0 ? 'Hey, my name is'
                                   : 'What, my name is' ) );

const onNameChange$ = new Rx.ReplaySubject( 1 ).switch();

ReactDOM.render( <Hello greeting$={greeting$} onNameChange$={onNameChange$} />,
  document.querySelector( '.copal-content' ) );

onNameChange$.subscribe( name => console.log( `DEBUG: name changed to '${name}'` ) );
