import styled from 'styled-components';
import Page from './components/Page';

const StyledApp = styled.div`
  width: 100%;
  padding: 10px;
`;

const App = () => (
  <StyledApp>
    <h1>event registry</h1>
    <Page />
  </StyledApp>);

export default App;
