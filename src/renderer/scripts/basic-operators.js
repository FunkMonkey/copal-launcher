// import Rx from 'rx';

export default function ( launcher ) {
  let lastRenderSubscription = null;

  return {
    'launcher.fromInput': () => launcher.input$.startWith( '' ),

    'launcher.render': ( [ source$ ] ) => {
      if ( lastRenderSubscription ) {
        lastRenderSubscription.dispose();
        lastRenderSubscription = null;
      }

      lastRenderSubscription = source$.subscribe( launcher.output$ );
    }
  };
}
