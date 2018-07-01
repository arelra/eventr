import { createFactory, Component } from 'react';
import eventRegistry from '../lib/eventRegistry';

// TODO
// shouldcomponentupdate
// add wrappedcomponent for testing
// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/withStateHandlers.js

const withEventHandlers = (initialState, eventHandlers) => (WrappedComponent) => {
  // function to create WrappedComponent
  const factory = createFactory(WrappedComponent);
  // avoid prop types
  const getId = props => props.id;

  class WithEventHandlers extends Component {
    constructor(props) {
      super(props);
      this.state = typeof initialState === 'function'
        ? initialState(props)
        : initialState;
      this.eventRegistryInstance = eventRegistry.getInstance();
      this.stateUpdaters = Object.entries(eventHandlers).reduce((acc, [eventType, handler]) => {
        acc[eventType] = ev =>
          this.setState((prevState, handlerProps) =>
            handler(prevState, handlerProps, ev));
        return acc;
      }, {});
    }
    componentWillMount() {
      Object.entries(this.stateUpdaters).forEach(([eventType, handler]) => {
        this.eventRegistryInstance.register(getId(this.props), eventType, handler);
      });
    }
    componentWillUnmount() {
      Object.entries(this.stateUpdaters).forEach(([eventType]) => {
        this.eventRegistryInstance.unregister(getId(this.props), eventType);
      });
    }
    render() {
      return factory({ ...this.props, ...this.state });
    }
  }
  return WithEventHandlers;
};

export default withEventHandlers;
