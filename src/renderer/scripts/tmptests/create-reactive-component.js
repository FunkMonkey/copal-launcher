import { createReactiveComponent } from 'reactive-react-component';
import React from 'react';
import { Observable } from 'rxjs';

const env = { React, Observable };
export default createReactiveComponent.bind( null, env );
