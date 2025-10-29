import { Flex, Select } from 'antd'
import styled from 'styled-components'

export const HeaderContainer = styled(Flex)`
  width: calc(100% - 240px);
  min-width: calc(100% - 240px);
  height: 64px;
  position: fixed;
  margin-left: 240px;
  background: ${({ theme }) => theme.colors.cardBg};
  box-shadow: 0 1px 4px ${({ theme }) => theme.colors.shadowColor};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  z-index: 100;
`

export const InlineSelect = styled(Select as any)`
  .ant-select-selector {
    max-height: 40px;
    overflow: hidden;
    display: flex;
    align-items: center;
    white-space: nowrap;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    
    &:hover {
      border-color: #1d4ed8;
    }
  }
  
  &.ant-select-focused .ant-select-selector {
    border-color: #1d4ed8;
    box-shadow: 0 0 0 2px rgba(29, 78, 216, 0.1);
  }
`
