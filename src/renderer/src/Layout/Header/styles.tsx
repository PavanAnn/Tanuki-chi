import { Flex } from 'antd'
import styled from 'styled-components'

export const HeaderContainer = styled(Flex)`
  width: calc(100% - 200px);
  min-width: calc(100% - 200px);
  height: 6vh;
  position: fixed;
  margin-left: 200px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  display: flex;
  flex-direction: row;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.bg};
`
