import React from 'react'
import { SidebarContainer, SidebarSection } from './styles'
import { Link } from 'react-router-dom'

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SidebarSection>
        Logo
      </SidebarSection>
      <SidebarSection>
        <Link to={'/'}>Home</Link>
      </SidebarSection>
      <SidebarSection>
        Add
      </SidebarSection>
    </SidebarContainer>
  )
}

export default Sidebar
