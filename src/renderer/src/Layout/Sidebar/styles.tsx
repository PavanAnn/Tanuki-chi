import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { Flex } from 'antd'

// SidebarContainer.ts
export const SidebarContainer = styled(Flex)`
  flex-direction: column;
  width: 12%; // Fixed width for consistency
  min-width: 200px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.sidebarBg || '#ffffff'};
  color: ${({ theme }) => theme.colors.sidebarText || '#4A4A4A'};
  padding: 0px 12px;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  gap: 16px;
`

// SidebarSection.ts
export const SidebarSection = styled(Link)`
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  font-size: 15px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.sidebarText || '#4A4A4A'};
  background-color: transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover || '#f5f5f5'};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.active || '#e0e7ff'};
    color: ${({ theme }) => theme.colors.activeText || '#1d4ed8'};
    font-weight: 600;
  }
`

export const SidebarHeader = styled.h1`
  font-size: 24px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const SidebarInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: none;
  font-size: 16px;
  outline: none;

  &:focus {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
`

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
`

export const SidebarLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: 18px;
  padding: 10px;
  border-radius: 4px;

  &.active {
    background-color: #1abc9c;
  }

  &:hover {
    background-color: #34495e;
  }
`
