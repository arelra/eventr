import styled from 'styled-components';
import Text from './Text';
import Circles from './Circles';
import Squares from './Squares';
import withEventListener from '../lib/withEventListener';

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

export default withEventListener(Page);
