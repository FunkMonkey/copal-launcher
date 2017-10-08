export default function ( launcher ) {
  return {
    'launcher.executeCommand': ( [ commandName$ ] ) =>
      commandName$.map( commandName => launcher.executeCommand( commandName ) ),

    'launcher.fromInput': () => launcher.input.from$.startWith( '' ),

    // TODO: make output$ reusable
    'launcher.render': ( [ source$ ] ) => source$.subscribe( launcher.output$.next /* , launcher.outputError$.next */ ),

    'launcher.listview.chosen': () => launcher.listview.chosen$
  };
}
