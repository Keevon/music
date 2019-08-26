import React from "react";
import { Document, Page } from "react-pdf";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styled from "styled-components";

import { post } from "../api";
import { Music } from "../types";

interface Props {
  addMusic(music: Music): void;
}

interface State extends Fields<string> {
  pdfFile: File | null;
}

interface Fields<T> {
  album: T;
  arranger: T;
  composer: T;
  game: T;
  title: T;
}
type Field = keyof Fields<void>;

const StyledForm = styled(Form)`
  display: flex;
`;

const PdfButton = styled(Button)`
  margin-right: 16px;
`;

const LeftSide = styled.div`
  flex: 1;
  margin-right: 16px;
`;

const RightSide = styled.div`
  flex: 0;
  min-width: 300px;
  width: 300px;
`;

class AddItemForm extends React.PureComponent<Props, State> {
  fileInput: React.RefObject<HTMLInputElement> = React.createRef();
  state: State = {
    album: "",
    arranger: "",
    composer: "",
    game: "",
    pdfFile: null,
    title: ""
  };

  handleChange = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ ...this.state, [field]: e.target.value });

  render() {
    const { pdfFile } = this.state;

    return (
      <StyledForm onSubmit={this.uploadMusic}>
        <LeftSide>
          {this.renderTextInput("title", "Title")}
          {this.renderTextInput("composer", "Composer")}
          {this.renderTextInput("arranger", "Arranger")}
          {this.renderTextInput("album", "Album")}
          {this.renderTextInput("game", "Game")}
          <PdfButton color="info" onClick={this.addMusic}>
            Choose PDF
          </PdfButton>
          <Button color="primary" type="submit">
            Add Music
          </Button>
        </LeftSide>
        <RightSide>
          <Document file={pdfFile}>
            <Page pageNumber={1} width={300} />
          </Document>
          <input
            accept="application/pdf"
            hidden
            onChange={this.fileChange}
            ref={this.fileInput}
            type="file"
          />
        </RightSide>
      </StyledForm>
    );
  }

  renderTextInput(field: Field, title: string) {
    return (
      <FormGroup>
        <Label for={field}>{title}</Label>
        <Input
          id={field}
          name={field}
          onChange={this.handleChange(field)}
          placeholder={title}
          type="text"
          value={this.state[field]}
        />
      </FormGroup>
    );
  }

  addMusic = () => this.fileInput.current && this.fileInput.current.click();

  fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      this.setState({ pdfFile: e.target.files[0] });
    }
  };

  uploadMusic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { addMusic } = this.props;
    const { album, arranger, composer, game, pdfFile, title } = this.state;

    if (pdfFile) {
      let data = new FormData();
      data.append("file", pdfFile);
      data.append("album", album);
      data.append("arranger", arranger);
      data.append("composer", composer);
      data.append("game", game);
      data.append("title", title);
      try {
        const res = await post("upload", data);
        addMusic(res.data.row);
      } catch (e) {
        console.error(e);
      }
    }
  };
}

export default AddItemForm;
