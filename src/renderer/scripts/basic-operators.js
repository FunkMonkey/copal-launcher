import open from 'open';
import { Observable } from 'rxjs';
import {
  flatMap, map, startWith, tap
} from 'rxjs/operators';

function connectObservableTo( observable$, observer ) {
  return new Observable( () => {
    const subscription = observable$.subscribe( observer );
    return () => subscription.unsubscribe();
  } );
}

export default function ( launcher ) {
  return {
    'launcher.instantiateCommand': ( [ commandName$ ] ) => commandName$
      .pipe( map( commandName => launcher.instantiateCommand( commandName ) ) ),

    'launcher.fromInput': () => launcher.input.from$.pipe( startWith( '' ) ),

    // TODO: make output$ reusable
    'launcher.render': ( [ data$ ] ) => launcher
      .getResultView( 'listview' ).pipe(
        flatMap( view => connectObservableTo( data$, view.sources.data$ ) )
      )
      .subscribe( () => {} ),

    'launcher.listview.chosen': () => launcher
      .getResultView( 'listview' ).pipe( flatMap( view => view.sinks.chosen$ ) ),

    'launcher.openExternal': ( [ source$ ] ) => source$
      .pipe( tap( fileOrURL => open( fileOrURL ) ) ),

    'launcher.listview.item.getURL': ( [ listItem$ ] ) => listItem$
      .pipe( map( listItem => listItem.url ) )
  };
}
