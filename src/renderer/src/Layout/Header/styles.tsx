import { Flex, Select } from 'antd'
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
  border: 1px solid ${({ theme }) => theme.colors.bg};
`
export const InlineSelect = styled(Select)`
  .ant-select-selector {
    max-height: 5vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
`
