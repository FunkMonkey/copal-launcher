
import React from 'react';
import { merge, ReplaySubject, Subject } from 'rxjs';
import { ignoreElements, map, share, switchAll } from 'rxjs/operators';
import ListView from '../list-view';
import Mounter from '../mounter';

export default function ( ) {
  const sources = {
    data$: new Subject(),
    enter$: new Subject(),
    reset$: new Subject(),
  };

  const enter$ = sources.enter$.pipe( share() );
  const selectIndex$ = merge( sources.reset$.pipe( map( () => -1 ) ),
                              enter$.pipe( map( () => 0 ) ) );
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
    chosen$: chosen$.pipe( switchAll(), share() ),
    componentDidMount$: componentDidMount$.pipe( ignoreElements() )
  };

  return {
    component,
    sources,
    sinks
  };
}
