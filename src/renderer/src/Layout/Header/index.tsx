import React from 'react'
import { HeaderContainer, SearchBar } from './styles'
import { useSearchStore } from '../../Features/Store/Search/useSearchStore'
import { useGetSearchWeebCentral } from '@renderer/Features/Fetchers/WeebCentral/Hooks'
import { useNavigate } from 'react-router-dom'
import { getAllProviderSearchResults } from '@renderer/Features/Store/useSearchAllProviders'

const Header: React.FC = () => {
  const { searchTerm, setSearchTerm, setData, setIsFetching, clear } = useSearchStore()

  const { refetch, isFetching } = useGetSearchWeebCentral(searchTerm)
  const navigate = useNavigate()

  const handleSearch = async () => {
    setSearchTerm(searchTerm)
    if (!searchTerm.trim()) return
  
    navigate('/')
    setIsFetching(true)
    const results = await getAllProviderSearchResults(searchTerm)
    setData(results)
    setIsFetching(false)
  }
  
  return (
    <HeaderContainer>
      <SearchBar
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for manga..."
      />
      <button onClick={handleSearch}>{isFetching ? 'Searching' : 'Search'}</button>
      <button onClick={() => clear()}>clear</button>
    </HeaderContainer>
  )
}

export default Header
