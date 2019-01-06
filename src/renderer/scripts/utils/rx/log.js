import { tap } from 'rxjs/operators';

export default function log( text ) {
  return source => source.pipe( tap( val => console.log( text, val ) ) );
}
