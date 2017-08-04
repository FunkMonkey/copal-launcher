import R from 'ramda';
import Rx from 'rxjs/Rx';

export default R.curry( ( name, source$ ) => Rx.Observable.create( observer => {
  console.log( `Observable '${name}' subscribed to` );
  const subscription = source$.subscribe( observer );
  return () => {
    subscription.dispose();
    console.log( `Observable '${name}' disposed` );
  };
} ) );
