import { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import eventRegistry from '../lib/eventRegistry';

const StyledCircle = styled.div`
  top: ${props => (props.y)}px;
  left: ${props => (props.x)}px;
  height: ${props => (props.r)}px;
  width: ${props => (props.r)}px;
  background-color: ${props => (props.col)};
  border-radius: 50%;
  position: absolute;
  border: ${props => (props.active ? '2px solid red' : '2px solid black')};
`;

class Circle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
    this.eventRegistryInstance = eventRegistry.getInstance();
    this.handleClick = this.handleClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.registerEventHandlers = this.registerEventHandlers.bind(this);
    this.unregisterEventHandlers = this.unregisterEventHandlers.bind(this);
    this.registerEventHandlers();
  }
  componentWillUnmount() {
    this.unregisterEventHandlers();
  }
  handleClick() {
    this.setState(prevState => ({
      active: !prevState.active,
    }));
  }
  handleClickOutside() {
    this.setState({ active: false });
  }
  registerEventHandlers() {
    this.eventRegistryInstance.register(this.props.id, 'click', this.handleClick);
    this.eventRegistryInstance.register(this.props.id, 'clickOutside', this.handleClickOutside);
  }
  unregisterEventHandlers() {
    this.eventRegistryInstance.unregister(this.props.id, 'click');
    this.eventRegistryInstance.unregister(this.props.id, 'clickOutside');
  }
  render() {
    return <StyledCircle active={this.state.active} {...this.props} />;
  }
}

Circle.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Circle;
