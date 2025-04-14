import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
`

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.bg};
  overflow-y: auto;
  margin-top: 6vh;
  min-width: calc(100% - 200px);
`

// ${({ theme }) => theme.colors.bg
