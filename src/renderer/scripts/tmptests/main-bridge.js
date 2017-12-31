import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './hello-bridge';

function onNameChange( name ) {
  console.log( `DEBUG: name changed to '${name}'` );
}

function updateGreeting( greeting ) {
  // updating the props for the root component
  ReactDOM.render( <Hello greeting={greeting} onNameChange={onNameChange} />,
                   document.querySelector( '.copal-content' ) );
}

let count = 0;
window.setInterval( () => {
  count++;
  const greeting = count % 2 === 0 ? 'Hey, my name is' : 'What, my name is';
  updateGreeting( greeting );
}, 3000 );
