import styled from 'styled-components'

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.bg};
`

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 32px;
  background-color: ${({ theme }) => theme.colors.bg};
  overflow-y: auto;
  margin-top: 64px;
`
