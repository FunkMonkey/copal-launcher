
import React from 'react';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import ListView from '../list-view';
import Mounter from '../mounter';

export default function ( ) {
  const sources = {
    data$: new Subject(),
    enter$: new Subject(),
    reset$: new Subject(),
  };

  const enter$ = sources.enter$.share();
  const selectIndex$ = Observable.merge( sources.reset$.map( () => -1 ), enter$.map( () => 0 ) );
  const chosen$ = new ReplaySubject( 1 );
  const componentDidMount$ = new Subject();

  const component = (
    <Mounter componentDidMount={componentDidMount$} >
      <ListView
        data$={sources.data$}
        selectIndex$={selectIndex$}
        focus$={enter$}
        chosenListItem$={chosen$}
      />
    </Mounter>
  );

  const sinks = {
    chosen$: chosen$.switch().share(),
    componentDidMount$: componentDidMount$.ignoreElements()
  };

  return {
    component,
    sources,
    sinks
  };
}
