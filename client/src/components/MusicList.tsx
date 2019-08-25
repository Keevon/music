import React from 'react';
import styled from 'styled-components';

import { get } from '../api';
import { Music } from '../types';

import AddMusicItem from './AddMusicItem';
import MusicItem from './MusicItem';

interface State {
  musicList: Music[];
}

const StyledMusicList = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  max-width: 1200px;
`;

class MusicList extends React.PureComponent<{}, State> {
  state: State = {
    musicList: [],
  };

  componentDidMount() {
    this.init();
  }

  render() {
    const { musicList } = this.state;

    return (
      <StyledMusicList>
        <AddMusicItem addMusic={this.addMusic} />
        {musicList.map(music => <MusicItem music={music} key={music.id} />)}
      </StyledMusicList>
    );
  }

  addMusic = (music: Music) => {
    this.setState({ musicList: [...this.state.musicList, music] });
  }

  init = async () => {
    const res = await get('get');
    this.setState({ musicList: res.data.rows });
  }
}

export default MusicList;
