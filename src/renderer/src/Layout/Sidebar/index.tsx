import React from 'react'
import { SidebarContainer, SidebarSection } from './styles'
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer vertical>
      <SidebarSection>Logo</SidebarSection>
      <SidebarSection>
        <Link to={'/'}>Search</Link>
      </SidebarSection>
      <SidebarSection>
        <Link to={'/bookmarks'}>Bookmarks</Link>
      </SidebarSection>
      <SidebarSection>
        <Link to={'/share'}>Import/Export</Link>
      </SidebarSection>
    </SidebarContainer>
  )
}

export default Sidebar
