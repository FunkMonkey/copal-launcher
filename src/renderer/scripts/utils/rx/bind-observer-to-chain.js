
export default function bindObserverToChain( from, chainCreator ) {
  const chainEnd = chainCreator( from )

  chainEnd.next = from.next.bind( from );
  chainEnd.error = from.error.bind( from );
  chainEnd.complete = from.complete.bind( from );
  chainEnd.boundObserver = from;

  return chainEnd;
}
