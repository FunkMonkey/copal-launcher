import * as rrc from 'reactive-react-component';
import React from 'react';
import { Observable, ReplaySubject } from 'rxjs';


const env = { React, Observable, ReplaySubject };

export default rrc.createReactiveComponent.bind( null, env );
