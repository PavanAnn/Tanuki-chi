import React from 'react'
import { HeaderContainer, SearchBar } from './styles'
import { useSearchStore } from '@renderer/Features/Store/Kakalot/useSearchStore';
import { useGetSearchWeebCentral } from '@renderer/Features/Fetchers/WeebCentral/Hooks';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
    const { searchTerm, setSearchTerm, setData, setIsFetching, clear } = useSearchStore();

    const { refetch, isFetching } = useGetSearchWeebCentral(searchTerm);
    const navigate = useNavigate();

    const handleSearch = async () => {
        setSearchTerm(searchTerm);
        if (!searchTerm.trim()) return;
    
        navigate('/');
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
