import styled from 'styled-components'

export const DetailTitle = styled.div`
  font-size: 42px;
  display: flex;
  gap: 22px;
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const BookmarkContainer = styled.div`
  display: flex;
  align-items: center;
`

export const DetailInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const ChaptersListWrapper = styled.div`
  display: inline-block;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  h1 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const ChaptersContainer = styled.div<{ isLatest: boolean }>`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ isLatest, theme }) => isLatest ? theme.colors.active : theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.textPrimary};
  gap: 12px;
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ isLatest, theme }) => isLatest ? theme.colors.active : theme.colors.hover};
    border-color: ${({ theme }) => theme.colors.activeText};
  }
`
