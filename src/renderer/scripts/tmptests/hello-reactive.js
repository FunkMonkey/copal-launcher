import createReactiveComponent from './create-reactive-component';
import definition from './hello-def';

export default createReactiveComponent( {
  displayName: 'Hello',
  definition
} );
