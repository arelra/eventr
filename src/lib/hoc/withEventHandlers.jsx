import { createFactory, Component } from 'react';
import eventRegistry from '../event-registry';

/**
 * A higher order component which takes initial state, an eventHandler map and a component.
 * Handlers will be decorated to become state updaters. If the event registry invokes
 * the handler the internal state is set to whatever is returned from the handler.
 * State is then spread to the props of the wrapped component.
 *
 * @param {object} initialState An object describing initial state
 * @param {object} eventHandlers A map of event types to handlers
 */
const withEventHandlers = (initialState, eventHandlers) => (WrappedComponent) => {
  const factory = createFactory(WrappedComponent);
  const getId = props => props.id; // avoid prop types

  class WithEventHandlers extends Component {
    constructor(props) {
      super(props);
      this.state = typeof initialState === 'function'
        ? initialState(props)
        : initialState;
      this.eventRegistryInstance = eventRegistry();
      /**
       * Handlers are decorated so that when invoked by the event registry the
       * return value from the handler is used to set the internal state of
       * this HOC. Internal state is then passed to WrappedComponent as props.
       *
       * Use a setTimeout to work around an issue where the browser does not clear
       * selected text immediately before a click event is fired which therefore
       * does not correctly represent the current state of the app.
       */
      this.stateUpdaters = Object.entries(eventHandlers).reduce((acc, [eventType, handler]) => {
        acc[eventType] = ev =>
          setTimeout(
            () =>
              this.setState((prevState, handlerProps) =>
                handler(prevState, handlerProps, ev))
            , 0,
          );
        return acc;
      }, {});
    }
    componentDidMount() {
      Object.entries(this.stateUpdaters).forEach(([eventType, handler]) => {
        this.eventRegistryInstance.registerHandler(getId(this.props), eventType, handler);
      });
    }
    componentWillUnmount() {
      Object.entries(this.stateUpdaters).forEach(([eventType]) => {
        this.eventRegistryInstance.unregisterHandler(getId(this.props), eventType);
      });
    }
    render() {
      return factory({ ...this.props, ...this.state });
    }
  }
  WithEventHandlers.WrappedComponent = WrappedComponent;
  return WithEventHandlers;
};

export default withEventHandlers;
