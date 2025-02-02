import React from 'react'
import { SidebarContainer, SidebarSection } from './styles'

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SidebarSection>
        Logo
      </SidebarSection>
      <SidebarSection>
        Home
      </SidebarSection>
      <SidebarSection>
        Add
      </SidebarSection>
    </SidebarContainer>
  )
}

export default Sidebar
