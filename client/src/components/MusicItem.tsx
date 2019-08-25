import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import routes from '../routes';

import { url } from '../api';
import { Music } from '../types';

import Item from './Item';

interface Props extends RouteComponentProps {
  music: Music;
}

const Title = styled.h5`
  margin-bottom: 20px;
`;
const Preview = styled.img`
  width: 100%;
`;

class MusicItem extends React.PureComponent<Props> {
  render() {
    const { music } = this.props;

    return (
      <Item onClick={this.handleClick}>
        <Title>{music.name}</Title>
        <Preview src={url(`preview/${music.id}`)} alt="Music" />
      </Item>
    );
  }

  handleClick = () => {
    const { history, music } = this.props;

    history.push(routes.music.toPath({ id: music.id }));
  }
}

export default withRouter(MusicItem);
