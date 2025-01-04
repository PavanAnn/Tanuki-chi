import styled from "styled-components"

export const LibListContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
`

export const LibItem = styled.div`
  padding: 4px 4px;
  background-color: #34495e;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #1abc9c;
  }
`
