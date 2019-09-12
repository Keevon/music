import { PDFDocumentProxy } from "pdfjs-dist";
import React from "react";
import { Document, Page } from "react-pdf";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Button } from "reactstrap";
import styled from "styled-components";

import { del, get, url } from "../api";
import routes from "../routes";
import { Music } from "../types";

interface MatchParams {
  id: string;
}

interface PagerProps {
  disabled: boolean;
}

interface State {
  music?: Music;
  numPages: number;
  pageNumber: number;
  url: string;
}

const StyledMusicView = styled.div`
  margin: 24px auto;
  max-width: 1200px;
`;

const MusicPager = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Pager = styled.div<PagerProps>`
  color: ${props =>
    props.disabled ? props.theme.colors.medium : props.theme.colors.dark};
  font-size: 50px;
  margin: 0 20px;
  &:hover {
    color: ${props =>
      props.disabled ? props.theme.colors.medium : props.theme.colors.darkest};
    cursor: pointer;
  }
`;

const PageInfo = styled.div`
  font-size: 18px;
  text-align: center;
`;

const DeleteButton = styled(Button)`
  text-align: center;
`;

class MusicView extends React.PureComponent<
  RouteComponentProps<MatchParams>,
  State
> {
  state: State = {
    numPages: 0,
    pageNumber: 1,
    url: url(`music/${this.props.match.params.id}`)
  };

  componentDidMount() {
    this.init();
  }

  render() {
    const { music, numPages, pageNumber, url } = this.state;

    if (!music) {
      return null;
    }

    return (
      <StyledMusicView>
        <PageInfo>{music.title}</PageInfo>
        <PageInfo>{music.track}</PageInfo>
        <PageInfo>{music.composer}</PageInfo>
        <PageInfo>{music.arranger}</PageInfo>
        <PageInfo>{music.album}</PageInfo>
        <PageInfo>{music.game}</PageInfo>
        <PageInfo>{music.genre}</PageInfo>
        <MusicPager>
          <Pager disabled={pageNumber <= 1} onClick={this.prev}>
            &lt;
          </Pager>
          <Document file={url} onLoadSuccess={this.handlePdfLoad}>
            <Page pageNumber={pageNumber} />
          </Document>
          <Pager disabled={pageNumber >= numPages} onClick={this.next}>
            &gt;
          </Pager>
        </MusicPager>
        <PageInfo>
          Page {pageNumber} of {numPages}
        </PageInfo>
        <DeleteButton color="danger" onClick={this.delete}>
          Delete Music
        </DeleteButton>
      </StyledMusicView>
    );
  }

  prev = () =>
    this.setState({ pageNumber: Math.max(this.state.pageNumber - 1, 1) });
  next = () =>
    this.setState({
      pageNumber: Math.min(this.state.pageNumber + 1, this.state.numPages)
    });

  handlePdfLoad = (pdf: PDFDocumentProxy) => {
    this.setState({ numPages: pdf.numPages });
  };

  init = async () => {
    const { id } = this.props.match.params;

    const res = await get(`get/${id}`);
    this.setState({ music: res.data });
  };

  delete = async () => {
    const { history } = this.props;
    const { id } = this.props.match.params;

    if (!window.confirm("Do you really want to delete this music?")) {
      return;
    }

    try {
      const res = await del(`delete/${id}`);
      history.push(routes.list.path);
    } catch (e) {
      console.error(e);
    }
  };
}

export default withRouter(MusicView);
