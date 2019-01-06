import R from 'ramda';
import { Observable } from 'rxjs';

export default R.curry( ( name, source$ ) => Observable.create( observer => {
  console.log( `Observable '${name}' subscribed to` );
  const subscription = source$.subscribe( observer );
  return () => {
    subscription.dispose();
    console.log( `Observable '${name}' disposed` );
  };
} ) );
