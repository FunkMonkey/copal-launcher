import open from 'open';

export default function ( launcher ) {
  return {
    'launcher.instantiateCommand': ( [ commandName$ ] ) =>
      commandName$.map( commandName => launcher.instantiateCommand( commandName ) ),

    'launcher.fromInput': () => launcher.input.from$.startWith( '' ),

    // TODO: make output$ reusable
    'launcher.render': ( [ source$ ] ) => source$.subscribe( launcher.output$.next /* , launcher.outputError$.next */ ),

    'launcher.listview.chosen': () => launcher.listview.chosen$,

    'launcher.openExternal': ( [ source$ ] ) => source$.do( fileOrURL => open( fileOrURL ) ),

    'launcher.listview.item.getURL': ( [ listItem$ ] ) => listItem$.map( listItem => listItem.url )
  };
}
