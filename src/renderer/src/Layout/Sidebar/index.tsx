import React from 'react'
import { useLocation } from 'react-router-dom'
import { SidebarContainer, SidebarSection, LogoContainer, AppName, NavContainer, ThemeToggle } from './styles'
import { Image, Flex } from 'antd'
import {
  SearchOutlined,
  StarOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  CloudDownloadOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  BulbFilled
} from '@ant-design/icons'
import logo from '../../assets/icon.png'
import { useTheme } from '../../contexts/ThemeContext'

const Sidebar: React.FC = () => {
  const location = useLocation()
  const { mode, toggleTheme } = useTheme()

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    { path: '/', label: 'Search', icon: <SearchOutlined /> },
    { path: '/bookmarks', label: 'Bookmarks', icon: <StarOutlined /> },
    { path: '/share', label: 'Import/Export', icon: <SwapOutlined /> },
    { path: '/status', label: 'Status', icon: <CheckCircleOutlined /> }
  ]

  return (
    <SidebarContainer vertical>
      <LogoContainer align="center" gap="12px">
        <Image preview={false} width="48px" height="48px" src={logo} />
        <AppName>Tanuki-chi</AppName>
      </LogoContainer>

      <NavContainer vertical gap="8px">
        {menuItems.map((item) => (
          <SidebarSection
            key={item.path}
            to={item.path}
            className={isActive(item.path) ? 'active' : ''}
          >
            {item.icon}
            <span>{item.label}</span>
          </SidebarSection>
        ))}
      </NavContainer>

      <Flex style={{ marginTop: 'auto', paddingTop: '24px' }}>
        <ThemeToggle onClick={toggleTheme}>
          {mode === 'light' ? <BulbOutlined /> : <BulbFilled />}
          <span>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </ThemeToggle>
      </Flex>

      {false && (
        <>
          <SidebarSection to="/update" className={isActive('/update') ? 'active' : ''}>
            <CloudDownloadOutlined />
            <span>Update App</span>
          </SidebarSection>
          <SidebarSection to="/about" className={isActive('/about') ? 'active' : ''}>
            <InfoCircleOutlined />
            <span>About</span>
          </SidebarSection>
        </>
      )}
    </SidebarContainer>
  )
}

export default Sidebar
