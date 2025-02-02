import React, { useState } from 'react'
import { HeaderContainer, SearchBar } from './styles'
import { useGetSearchKakalot } from '@renderer/Features/Fetchers/Kakalot/Hooks';
import { useSearchStore } from '@renderer/Features/Store/Kakalot/useSearchStore';

const Header: React.FC = () => {
    const { searchTerm, setSearchTerm, setData, setIsFetching } = useSearchStore();

    const { data, refetch, isFetching } = useGetSearchKakalot(searchTerm);

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
        <button onClick={() => console.log(data)}>validate</button>
    </HeaderContainer>
  )
}

export default Header
