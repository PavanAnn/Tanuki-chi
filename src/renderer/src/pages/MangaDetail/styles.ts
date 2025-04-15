import styled from 'styled-components'

export const DetailTitle = styled.div`
  font-size: 42px;
  display: flex;
  gap: 22px;
`

export const BookmarkContainer = styled.div`
  display: flex;
  align-items: center;
`

export const DetailInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`
export const ChaptersListWrapper = styled.div`
  display: inline-block;
`

export const ChaptersContainer = styled.div<{ isLatest: boolean }>`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  background-color: ${({ isLatest, theme }) => isLatest ? theme.colors.primary : 'transparent'};
  gap: 12px;
  margin-bottom: 8px;
  padding: 4px 8px;
`
