import React from 'react';

export default class Mounter extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line react/prop-types
    this.props.componentDidMount.complete();
  }

  render() {
    // eslint-disable-next-line react/prop-types
    return <React.Fragment>{this.props.children}</React.Fragment>;
  }
}
