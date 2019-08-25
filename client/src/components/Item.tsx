import React from 'react';
import styled from 'styled-components';

interface Props {
  onClick: () => void;
}

const StyledItem = styled.div`
  border: 1px solid ${props => props.theme.colors.medium};
  color: ${props => props.theme.colors.dark};
  height: 375px;
  margin: 50px;
  padding: 20px;
  text-align: center;
  width: 250px;
  &:hover {
    border: 1px solid ${props => props.theme.colors.dark};
    color: ${props => props.theme.colors.darkest};
    cursor: pointer;
  }
`;

class Item extends React.PureComponent<Props> {
  render() {
    const { children, onClick } = this.props;

    return (
      <StyledItem onClick={onClick}>
        {children}
      </StyledItem>
    );
  }
}

export default Item;
