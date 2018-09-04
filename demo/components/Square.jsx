import styled from 'styled-components';
import withEventHandlers from '../../src/hoc/withEventHandlers';

const StyledSquare = styled.div`
  top: ${props => (props.y)}px;
  left: ${props => (props.x)}px;
  height: ${props => (props.r)}px;
  width: ${props => (props.r)}px;
  background-color: ${props => (props.col)};
  position: absolute;
  border: ${props => (props.active ? '2px solid red' : '2px solid black')};
`;

export default withEventHandlers(
  { active: false },
  {
    click: prevState => ({ active: !prevState.active }),
    clickOutside: () => ({ active: false }),
  },
)(props => <StyledSquare {...props} />);
