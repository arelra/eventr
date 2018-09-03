import React from 'react';
import eventRegistry from '../event-registry';

/**
 * A higher order component to create an event listener.
 *
 * The component ref is the element we attach event listeners to in the event registry.
 *
 * @param {Component} WrappedComponent
 */
const withEventListener = (WrappedComponent) => {
  class Component extends React.Component {
    constructor(props) {
      super(props);
      this.eventRegistryInstance = eventRegistry();
    }
    componentDidMount() {
      this.eventRegistryInstance.attachListener(this.ref);
    }
    componentWillUnmount() {
      this.eventRegistryInstance.detachListener(this.ref);
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          setRef={(ref) => { this.ref = ref; }}
        />
      );
    }
  }
  Component.WrappedComponent = WrappedComponent;
  return Component;
};

export default withEventListener;
