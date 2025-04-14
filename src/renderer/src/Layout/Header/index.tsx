import React from 'react'
import { HeaderContainer } from './styles'
import { useSearchStore } from '../../Features/Store/Search/useSearchStore'
import { useNavigate } from 'react-router-dom'
import { getAllProviderSearchResults } from '@renderer/Features/Store/useSearchAllProviders'
import Search from 'antd/es/input/Search'

const Header: React.FC = () => {
  const { setSearchTerm, setData, setIsFetching, clear, isFetching } = useSearchStore()

  const navigate = useNavigate()

  const handleSearch = async (value: string) => {
    const trimmed = value.trim()
    setSearchTerm(trimmed)
    if (!trimmed) return

    navigate('/')
    setIsFetching(true)
    const results = await getAllProviderSearchResults(trimmed)
    setData(results)
    setIsFetching(false)
  }

  return (
    <HeaderContainer gap={'12px'} align="center">
      <Search
        style={{ width: '80%', marginLeft: '20px' }}
        onSearch={handleSearch}
        onClear={() => clear()}
        placeholder="Search for mangas"
        enterButton="Search"
        size="large"
        loading={isFetching}
        allowClear
      />
    </HeaderContainer>
  )
}

export default Header
