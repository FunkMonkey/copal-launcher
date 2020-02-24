
export default function bindObserver( from, to ) {
  if ( !to ) to = from;

  to.next = from.next.bind( from );
  to.error = from.error.bind( from );
  to.complete = from.complete.bind( from );
  to.boundObserver = from;

  return to;
}
