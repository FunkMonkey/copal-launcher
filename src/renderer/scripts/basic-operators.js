// import Rx from 'rx';

import logSubscription from './utils/log-subscription';

export default function ( launcher ) {
  return {
    'launcher.executeCommand': ( [ commandName$ ] ) =>
      commandName$.map( commandName => launcher.executeCommand( commandName ) ),

    'launcher.fromInput': () => launcher.input.from$.startWith( '' ),

    'launcher.render': ( [ source$ ] ) => source$.subscribe( launcher.output$ ),

    'launcher.listview.chosen': () => launcher.listview.chosen$
  };
}
