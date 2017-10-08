import * as rrc from 'reactive-react-component';
import React from 'react';
import Rx from 'rxjs/Rx';

const env = { React, Observable: Rx.Observable };

export default rrc.createReactiveComponent.bind( null, env );
