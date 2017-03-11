import Rx from 'rx';

export default function ( ) {
  return {
    'launcher.fromInput': () =>
      Rx.Observable.from( ['c', 'co', 'col'] ),

    'launcher.render': ( [ source$ ] ) =>
      source$.subscribe( items => { console.log( items ); } )
  };
}
