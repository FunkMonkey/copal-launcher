import * as cycleView from 'cycle-view';
import React from 'react';
import Rx from 'rxjs/Rx';

const env = { React, Observable: Rx.Observable };

export default cycleView.React.createReactiveComponent.bind( null, env );
