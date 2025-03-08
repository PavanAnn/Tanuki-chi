import React from 'react'
import { HeaderContainer, SearchBar } from './styles'
import { useSearchStore } from '@renderer/Features/Store/Kakalot/useSearchStore';
import { useGetSearchWeebCentral } from '@renderer/Features/Fetchers/WeebCentral/Hooks';

const Header: React.FC = () => {
    const { searchTerm, setSearchTerm, setData, setIsFetching, clear } = useSearchStore();

    const { data, refetch, isFetching } = useGetSearchWeebCentral(searchTerm);

    const handleSearch = async () => {
        setSearchTerm(searchTerm);
        if (!searchTerm.trim()) return;
    
        setIsFetching(true);
        const { data } = await refetch();
        setData(data?.response.data);
        setIsFetching(false);
        };

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
