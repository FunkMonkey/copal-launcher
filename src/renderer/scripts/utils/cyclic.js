import Cycle from 'cycle-react';
import React from 'react';
import Rx from 'rx';

export function component( displayName, definitionFn, options ) {
  return Cycle.component( displayName, ( interactions, properties, comp,
                                         lifecycles, renderScheduler ) => {
    const cycle = properties.value.cycle;
    const sinks = definitionFn( cycle.sources, interactions, properties,
                                comp, lifecycles, renderScheduler );

    if ( Rx.Observable.isObservable( sinks ) ) {
      cycle.sinks.onNext( { dom$: sinks } );
      return sinks;
    }

    cycle.sinks.onNext( sinks );
    return sinks.dom$;
  }, options );
}

export function instance( Component, sources ) {
  const cycle = { sources, sinks: new Rx.Subject() };
  const compo = <Component cycle={cycle} />;
  const sinks$ = cycle.sinks.shareReplay( 1 ).first();

  const result = Object.create( compo );
  result.getEvent = name => sinks$.flatMapFirst( sinks => {
    if ( !sinks[ name ] )
      throw new Error( `Component '${Component.displayName}' does not provide an event '${name}'` );
    return sinks[ name ];
  } );

  return result;
}
