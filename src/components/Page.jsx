import styled from 'styled-components';
import Text from './Text';
import Circles from './Circles';
import Squares from './Squares';
import withEventsListener from '../lib/withEventsListener';

const StyledPage = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
`;

const Page = () => (
  <StyledPage>
    <Text />
    <Circles />
    <Squares />
  </StyledPage>
);

export default withEventsListener(Page);
