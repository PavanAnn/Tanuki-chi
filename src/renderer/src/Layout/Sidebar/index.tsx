import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarContainer, SidebarSection } from './styles'
import { Divider, Flex, Image } from 'antd'
import logo from '../../assets/icon.png'
const Sidebar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <SidebarContainer vertical>
      <Flex style={{ height: '6vh' }} align="center">
        <Image preview={false} width="48px" src={logo} />
        <Flex style={{ fontFamily: `"Hachi Maru Pop", cursive`, fontWeight: '800' }}>
          Tanuki-chi
        </Flex>
      </Flex>
      <Divider style={{ margin: '0px' }} />
      <Flex vertical gap={'12px'} style={{ marginTop: '20px' }}>
        <SidebarSection className={isActive('/') ? 'active' : ''}>
          <Link to="/">Search</Link>
        </SidebarSection>
        <SidebarSection className={isActive('/bookmarks') ? 'active' : ''}>
          <Link to="/bookmarks">Bookmarks</Link>
        </SidebarSection>
        <SidebarSection className={isActive('/share') ? 'active' : ''}>
          <Link to="/share">Import/Export</Link>
        </SidebarSection>
      </Flex>
    </SidebarContainer>
  )
}

export default Sidebar
