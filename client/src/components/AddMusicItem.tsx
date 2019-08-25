import React from 'react';
import { Document, Page } from 'react-pdf';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import styled from 'styled-components';

import { post } from '../api';
import { Music } from '../types';

import Item from './Item';

interface Props {
  addMusic(music: Music): void;
}

interface State {
  addModalOpen: boolean;
  pdfFile: File | null;
}

const StyledAddItemView = styled.div`
  font-size: 100px;
  line-height: 335px;
`;

class AddItemView extends React.PureComponent<Props, State> {
  fileInput: React.RefObject<HTMLInputElement> = React.createRef();
  state = {
    addModalOpen: false,
    pdfFile: null,
  };

  render() {
    const { addModalOpen, pdfFile } = this.state;

    return (
      <Item onClick={this.openModal}>
        <StyledAddItemView>
          ＋
        </StyledAddItemView>
        <Modal isOpen={addModalOpen} onClick={this.closeModal}>
          <ModalHeader toggle={this.closeModal}>Add Music</ModalHeader>
          <ModalBody>
            <Button color="info" onClick={this.addMusic}>Upload Music</Button>
            <Document file={pdfFile}>
              <Page pageNumber={1} />
            </Document>
          </ModalBody>
          <input accept="application/pdf" hidden onChange={this.fileChange} ref={this.fileInput} type="file" />
        </Modal>
      </Item>
    );
  }

  openModal = () => this.setState({ addModalOpen: true });

  closeModal = () => this.setState({ addModalOpen: false });

  addMusic = () => this.fileInput.current && this.fileInput.current.click();

  fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      this.setState({ pdfFile: e.target.files[0] });
    }
  }

  uploadMusic = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { addMusic } = this.props;

    if (e.target.files) {
      let data = new FormData();
      data.append('file', e.target.files[0]);
      try {
        const res = await post('upload', data);
        addMusic(res.data.row);
      } catch(e) {
        console.error(e);
      }
    }
  }
}

export default AddItemView;
