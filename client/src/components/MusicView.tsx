import { PDFDocumentProxy } from 'pdfjs-dist';
import React from 'react';
import { Document, Page } from 'react-pdf';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { url } from '../api';

interface MatchParams {
  id: string;
}

interface PagerProps {
  disabled: boolean;
}

interface State {
  numPages: number;
  pageNumber: number;
  url: string;
}

const StyledMusicView = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

const MusicPager = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const Pager = styled.div<PagerProps>`
  color: ${props => props.disabled ? props.theme.colors.medium : props.theme.colors.dark};
  font-size: 50px;
  margin: 0 20px;
  &:hover {
    color: ${props => props.disabled ? props.theme.colors.medium : props.theme.colors.darkest};
    cursor: pointer;
  }
`;

const PageInfo = styled.div`
  font-size: 18px;
  text-align: center;
`;

class MusicView extends React.PureComponent<RouteComponentProps<MatchParams>, State> {
  state = {
    numPages: 0,
    pageNumber: 1,
    url: url(`music/${this.props.match.params.id}`)
  };

  render() {
    const { numPages, pageNumber, url } = this.state;

    return (
      <StyledMusicView>
        <MusicPager>
          <Pager disabled={pageNumber <= 1} onClick={this.prev}>&lt;</Pager>
          <Document file={url} onLoadSuccess={this.handlePdfLoad}>
            <Page pageNumber={pageNumber} />
          </Document>
          <Pager disabled={pageNumber >= numPages} onClick={this.next}>&gt;</Pager>
        </MusicPager>
        <PageInfo>Page {pageNumber} of {numPages}</PageInfo>
      </StyledMusicView>
    );
  }

  prev = () => this.setState({ pageNumber: Math.max(this.state.pageNumber - 1, 1) });
  next = () => this.setState({ pageNumber: Math.min(this.state.pageNumber + 1, this.state.numPages) });

  handlePdfLoad = (pdf: PDFDocumentProxy) => {
    this.setState({ numPages: pdf.numPages });
  }
}

export default withRouter(MusicView);
