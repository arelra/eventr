import { Component } from 'react';
import styled from 'styled-components';
import Text from '../Text';
import Circles from '../Circles';
import Squares from '../Squares';
import eventRegistry from '../../lib/eventRegistry';

const StyledPage = styled.div`
width: 50 %;
height: 100 %;
position: relative;
`;

class Page extends Component {
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
      <StyledPage innerRef={this.attachEventRegistry} >
        <Text />
        <Circles />
        <Squares />
      </StyledPage >);
  }
}

export default Page;
