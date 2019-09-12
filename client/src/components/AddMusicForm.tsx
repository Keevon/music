import React from "react";
import { Document, Page } from "react-pdf";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import styled from "styled-components";

import { get, post } from "../api";
import { Music } from "../types";
import { ValueType } from "react-select/src/types";

interface Props {
  addMusic(music: Music): void;
}

interface State extends Fields<string> {
  pdfFile: File | null;
  searching: Fields<boolean>;
  submitting: boolean;
}

interface Fields<T> {
  album: T;
  arranger: T;
  composer: T;
  game: T;
  genre: T;
  title: T;
  track: T;
}
type Field = keyof Fields<void>;

const StyledForm = styled(Form)`
  display: flex;
`;

const FormButton = styled(Button)`
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

const defaultState: State = {
  album: "",
  arranger: "",
  composer: "",
  game: "",
  genre: "",
  pdfFile: null,
  searching: {
    album: false,
    arranger: false,
    composer: false,
    game: false,
    genre: false,
    title: false,
    track: false
  },
  submitting: false,
  title: "",
  track: ""
};

class AddItemForm extends React.PureComponent<Props, State> {
  fileInput: React.RefObject<HTMLInputElement> = React.createRef();
  state: State = defaultState;

  handleChange = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ ...this.state, [field]: e.target.value });

  handleSelectChange = (field: Field) => (value: ValueType<string>) =>
    this.setState({ ...this.state, [field]: value });

  render() {
    const { pdfFile, submitting } = this.state;

    return (
      <StyledForm onSubmit={this.uploadMusic}>
        <LeftSide>
          {this.renderTextInput("title", "Title")}
          {this.renderAsyncInput("album", "Album")}
          {this.renderAsyncInput("game", "Game")}
          {this.renderTextInput("track", "Track #")}
          {this.renderAsyncInput("genre", "Genre")}
          {this.renderAsyncInput("composer", "Composer")}
          {this.renderAsyncInput("arranger", "Arranger")}
          <FormButton
            color="info"
            disabled={submitting}
            onClick={this.addMusic}
          >
            Choose PDF
          </FormButton>
          <FormButton
            color="secondary"
            disabled={submitting}
            onClick={this.clear}
          >
            Clear
          </FormButton>
          <FormButton color="primary" disabled={submitting} type="submit">
            Add Music
          </FormButton>
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

  renderAsyncInput(field: Field, title: string) {
    const { searching } = this.state;
    return (
      <FormGroup>
        <Label for={field}>{title}</Label>
        <AsyncCreatableSelect
          cacheOptions
          defaultOptions
          id={field}
          isLoading={searching[field]}
          isSearchable
          loadOptions={this.loadOptions(field)}
          name={field}
          onChange={this.handleSelectChange(field)}
          placeholder={title}
          type="text"
          value={this.state[field]}
        />
      </FormGroup>
    );
  }

  loadOptions = (field: Field) => async (value: string): Promise<string[]> => {
    this.setState({ searching: { ...this.state.searching, [field]: true } });
    const res = await get(`query/${field}/${value.toLowerCase()}`);
    this.setState({ searching: { ...this.state.searching, [field]: false } });
    return res.data.rows;
  };

  clear = () => this.setState(defaultState);

  addMusic = () => this.fileInput.current && this.fileInput.current.click();

  fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      this.setState({ pdfFile: e.target.files[0] });
    }
  };

  uploadMusic = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    this.setState({ submitting: true });

    const { addMusic } = this.props;
    const {
      album,
      arranger,
      composer,
      game,
      genre,
      pdfFile,
      title,
      track
    } = this.state;

    if (pdfFile) {
      let data = new FormData();
      data.append("file", pdfFile);
      data.append("album", album);
      data.append("arranger", arranger);
      data.append("composer", composer);
      data.append("game", game);
      data.append("genre", genre);
      data.append("title", title);
      data.append("track", track);
      try {
        const res = await post("upload", data);
        addMusic(res.data.row);
      } catch (e) {
        console.error(e);
      } finally {
        this.setState({
          pdfFile: null,
          submitting: false,
          title: "",
          track: ""
        });
      }
    }
  };
}

export default AddItemForm;
