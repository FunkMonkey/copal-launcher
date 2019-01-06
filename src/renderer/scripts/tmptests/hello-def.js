import { Observable, Subject } from 'rxjs';
import React from 'react';

export default function ( sources ) {
  const onChange$ = new Subject();
  const name$ = onChange$.map( evt => evt.target.value ).startWith( '' );

  const view$ = Observable.combineLatest( sources.greeting$, name$ )
    .map( ( [greeting, name] ) => (
      <div>
        <h1>{greeting}: {name}</h1>
        Your Name: <input onChange={onChange$.next.bind( onChange$ )} />
      </div>
    ) );

  return {
    view$,
    onNameChange$: name$
  };
}
