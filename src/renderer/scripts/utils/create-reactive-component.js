import * as rrc from 'reactive-react-component';
import React from 'react';
import { Observable } from 'rxjs';


const env = { React, Observable };

export default rrc.createReactiveComponent.bind( null, env );
