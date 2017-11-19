export default function ( launcher ) {
  return {
    'launcher.executeCommandGraph': ( [ commandName$ ] ) =>
      commandName$.map( commandName => launcher.executeCommandGraph( commandName ) ),

    'launcher.fromInput': () => launcher.input.from$.startWith( '' ),

    // TODO: make output$ reusable
    'launcher.render': ( [ source$ ] ) => source$.subscribe( launcher.output$.next /* , launcher.outputError$.next */ ),

    'launcher.listview.chosen': () => launcher.listview.chosen$
  };
}
