import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import styled from "styled-components";

import { Music } from "../types";

import AddMusicForm from "./AddMusicForm";
import Item from "./Item";

interface Props {
  addMusic(music: Music): void;
}

interface State {
  addModalOpen: boolean;
}

const StyledAddItemView = styled.div`
  font-size: 100px;
  line-height: 335px;
`;

class AddItemView extends React.PureComponent<Props, State> {
  fileInput: React.RefObject<HTMLInputElement> = React.createRef();
  state: State = {
    addModalOpen: false
  };

  render() {
    const { addMusic } = this.props;
    const { addModalOpen } = this.state;

    return (
      <Item onClick={this.openModal}>
        <StyledAddItemView>＋</StyledAddItemView>
        <Modal isOpen={addModalOpen} toggle={this.closeModal} size="lg">
          <ModalHeader toggle={this.closeModal}>Add Music</ModalHeader>
          <ModalBody>
            <AddMusicForm addMusic={addMusic} />
          </ModalBody>
        </Modal>
      </Item>
    );
  }

  openModal = () => this.setState({ addModalOpen: true });

  closeModal = () => this.setState({ addModalOpen: false });
}

export default AddItemView;
