import styled from 'styled-components'

export const HomeContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: ${({ theme }) => theme.colors.textPrimary};
  
  h1, h2 {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const MangaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`

export const MangaCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px ${({ theme }) => theme.colors.shadowColor};

  h2 {
    font-size: 1.25rem;
    margin-bottom: 8px;
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`
