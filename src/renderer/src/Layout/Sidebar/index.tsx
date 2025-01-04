import React from 'react'
import { SidebarContainer, SidebarHeader, SidebarNav, SidebarLink, SidebarSection, SidebarInput } from './styles'
import LibList from './LibList'

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SidebarHeader>Tanukichi</SidebarHeader>
      <SidebarSection>
        <h2>Library</h2>
        <SidebarInput type="text" placeholder="Search..." />
      </SidebarSection>
      <SidebarNav>
        <LibList />
      </SidebarNav>
    </SidebarContainer>
  )
}

export default Sidebar
