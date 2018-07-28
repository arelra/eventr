import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from './Text';
import Circles from './Circles';
import Squares from './Squares';
import withEventListener from '../lib/hoc/withEventListener';

const StyledPage = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
`;

class Page extends Component {
  componentDidMount() {
    if (this.container) {
      this.props.setRef(this.container);
    }
  }
  render() {
    return (
      <StyledPage innerRef={(container) => { this.container = container; }}>
        <Text />
        <Circles />
        <Squares />
      </StyledPage>
    );
  }
}

Page.propTypes = {
  setRef: PropTypes.func.isRequired,
};

export default withEventListener(Page);
