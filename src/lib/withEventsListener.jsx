import { Component } from 'react';
import eventRegistry from '../lib/eventRegistry';

const withEventsListener = WrappedComponent => class extends Component {
  constructor(props) {
    super(props);
    this.eventRegistryInstance = eventRegistry.getInstance();
    this.attachEventRegistry = this.attachEventRegistry.bind(this);
  }
  componentWillUnmount() {
    this.eventRegistryInstance.detach(this.ref);
  }
  attachEventRegistry(ref) {
    this.ref = ref;
    this.eventRegistryInstance.attach(ref);
  }
  render() {
    return (
      <div ref={this.attachEventRegistry}>
        <WrappedComponent {...this.props} />
      </div>
    );
  }
};

export default withEventsListener;
