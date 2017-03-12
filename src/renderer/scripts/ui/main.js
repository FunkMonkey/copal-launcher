import Cycle from 'cycle-react';
import React from 'react';
import Rx from 'rx';

function createInput( actions ) {
  const value$ = actions.get( 'OnChange' )
    .map( ev => ev.target.value );


  const dom$ = Rx.Observable.just(
    <input
      type="edit"
      className="copal-main-input"
      onChange={actions.listener( 'OnChange' )}
    />
  );

  return {
    dom$,
    value$
  };
}

function createListView( actions, model ) {
  const dom$ = model.data$
    .startWith( [] )
    .map( data => {
      const listItems = data.map( d => <div className="list-item" key={d}>{d}</div> );

      return (
        <div className="copal-view-list">
          {listItems}
        </div>
      );
    } );

  return { dom$ };
}

export default Cycle.component( 'Main', ( actions, props, self ) => {
  const launcher = self.props.launcher;
  const inputComponent = createInput( actions );
  inputComponent.value$.subscribe( launcher.input$ );
  const listViewComponent = createListView( actions, { data$: launcher.output$ } );

  return Rx.Observable.combineLatest( inputComponent.dom$, listViewComponent.dom$,
   ( inputDOM, listViewDOM ) =>
     <div className="copal-main">
       <div className="copal-main-settings-button">...</div>

       <div className="copal-main-top-row copal-dark-box">
         <button className="copal-main-command">NAME</button>
         {inputDOM}
       </div>

       <div className="copal-main-resultbox copal-dark-box">
         {listViewDOM}
       </div>
     </div>
   );
} );
