import open from 'open';
import { Observable } from 'rxjs';

function connectObservableTo( observable$, observer ) {
  return new Observable( () => {
    const subscription = observable$.subscribe( observer );
    return () => subscription.unsubscribe();
  } );
}

export default function ( launcher ) {
  return {
    'launcher.instantiateCommand': ( [ commandName$ ] ) =>
      commandName$.map( commandName => launcher.instantiateCommand( commandName ) ),

    'launcher.fromInput': () => launcher.input.from$.startWith( '' ),

    // TODO: make output$ reusable
    'launcher.render': ( [ data$ ] ) => launcher
      .getResultView( 'listview' )
      .flatMap( view => connectObservableTo( data$, view.sources.data$ ) )
      .subscribe( () => {} ),

    'launcher.listview.chosen': () => launcher
      .getResultView( 'listview' ).flatMap( view => view.sinks.chosen$ ),

    'launcher.openExternal': ( [ source$ ] ) => source$.do( fileOrURL => open( fileOrURL ) ),

    'launcher.listview.item.getURL': ( [ listItem$ ] ) => listItem$.map( listItem => listItem.url )
  };
}
