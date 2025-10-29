import styled from 'styled-components'
import { Link, NavLink } from 'react-router-dom'
import { Flex } from 'antd'

export const SidebarContainer = styled(Flex)`
  flex-direction: column;
  width: 240px;
  min-width: 240px;
  height: 100vh;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.sidebarText};
  padding: 24px 16px;
  box-shadow: 2px 0 12px ${({ theme }) => theme.colors.shadowColor};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`

export const LogoContainer = styled(Flex)`
  padding: 12px 8px;
  margin-bottom: 32px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
  }
`

export const AppName = styled.div`
  font-family: "Hachi Maru Pop", cursive;
  font-weight: 800;
  font-size: 20px;
  background: ${({ theme }) => 
    theme.colors.sidebarBg === '#25262b' 
      ? 'linear-gradient(135deg, #4c6ef5 0%, #748ffc 100%)'
      : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
`

export const NavContainer = styled(Flex)`
  flex-direction: column;
`

export const SidebarSection = styled(Link)`
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.sidebarText || '#5f6368'};
  background-color: transparent;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 0;
    background: linear-gradient(180deg, #1d4ed8 0%, #3b82f6 100%);
    border-radius: 0 4px 4px 0;
    transition: height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover || '#f1f3f4'};
    color: ${({ theme }) => theme.colors.activeText || '#1d4ed8'};
    transform: translateX(4px);
    
    &::before {
      height: 60%;
    }
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.active || '#e8f0fe'};
    color: ${({ theme }) => theme.colors.activeText || '#1d4ed8'};
    font-weight: 600;
    
    &::before {
      height: 70%;
    }
    
    svg {
      transform: scale(1.1);
    }
  }

  svg {
    font-size: 18px;
    transition: transform 0.2s ease;
  }

  span {
    user-select: none;
  }
`

export const ThemeToggle = styled.button`
  width: 100%;
  height: 44px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 14px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.sidebarText || '#5f6368'};
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border || '#e8eaed'};
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.hover || '#f1f3f4'};
    color: ${({ theme }) => theme.colors.activeText || '#1d4ed8'};
    border-color: ${({ theme }) => theme.colors.activeText || '#1d4ed8'};
    transform: translateX(4px);
  }

  svg {
    font-size: 18px;
    transition: transform 0.2s ease;
  }

  span {
    user-select: none;
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
