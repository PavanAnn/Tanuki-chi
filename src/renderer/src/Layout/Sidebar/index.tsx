import React from 'react'
import { useLocation } from 'react-router-dom'
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
      <Divider style={{ margin: '-10% 0px 0px 0px' }} />
      <Flex vertical gap={'12px'} style={{ marginTop: '20px' }}>
        <SidebarSection to="/" className={isActive('/') ? 'active' : ''}>
          Search
        </SidebarSection>
        <SidebarSection to="/bookmarks" className={isActive('/bookmarks') ? 'active' : ''}>
          Bookmarks
        </SidebarSection>
        <SidebarSection to="/share" className={isActive('/share') ? 'active' : ''}>
          Import/Export
        </SidebarSection>
        <SidebarSection to="/status" className={isActive('/status') ? 'active' : ''}>
          Status
        </SidebarSection>
        {false && (
          <>
            <SidebarSection to="/update" className={isActive('/update') ? 'active' : ''}>
              Update App
            </SidebarSection>
            <SidebarSection to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </SidebarSection>
          </>
        )}
      </Flex>
    </SidebarContainer>
  )
}

export default Sidebar
