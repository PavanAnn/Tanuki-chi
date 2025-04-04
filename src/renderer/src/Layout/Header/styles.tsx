import styled from 'styled-components'

export const HeaderContainer = styled.div`
  width: 90%;
  height: 6vh;
  position: fixed;
  margin-left: 10%;
  background-color: #171738;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border: 1px solid #2E1760;

`

export const SearchBar = styled.input`
  width: 80%;
  height: 60%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  outline: none;
  margin: auto;

  &:focus {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`
