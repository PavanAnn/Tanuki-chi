import styled from 'styled-components'
import { Divider as AntDivider } from 'antd'

export const ThemedDivider = styled(AntDivider)`
  border-color: ${({ theme }) => theme.colors.secondary};
`
