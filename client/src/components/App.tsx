import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import styled from 'styled-components';

import routes from '../routes';

import MusicList from './MusicList';
import MusicView from './MusicView';

const StyledApp = styled.div`
  text-align: center;
`;

const Header = styled.header`
  align-items: center;
  background-color: ${props => props.theme.colors.darkest};
  color: ${props => props.theme.colors.lightest};
  display: flex;
  font-size: 24px;
  height: 80px;
  justify-content: center;
  position: sticky;
  & a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: inherit;
      text-decoration: none;
    }
  }
`;

const App: React.StatelessComponent = () => (
  <StyledApp>
    <Router>
      <Header>
        <Link to={routes.list.path}>
          Video Game Sheet Music Club
        </Link>
      </Header>
      <Route path={routes.list.path} exact component={MusicList} />
      <Route path={routes.music.path} component={MusicView} />
    </Router>
  </StyledApp>
);

export default App;
