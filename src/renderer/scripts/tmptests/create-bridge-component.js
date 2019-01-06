import { createBridgeComponent } from 'reactive-react-component';
import React from 'react';
import { Observable } from 'rxjs';

const env = { React, Observable };
export default createBridgeComponent.bind( null, env );
