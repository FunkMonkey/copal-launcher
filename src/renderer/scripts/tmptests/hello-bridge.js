import createBridgeComponent from './create-bridge-component';
import definition from './hello-def';

export default createBridgeComponent( {
  displayName: 'Hello',
  definition,
  sources: {
    greeting$: { propName: 'greeting' }
  },
  sinks: {
    onNameChange$: { propName: 'onNameChange' }
  }
} );
