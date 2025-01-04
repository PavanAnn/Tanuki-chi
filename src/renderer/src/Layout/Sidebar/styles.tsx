import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #171738;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  gap: 16px;
  overflow-y: auto;
  scrollbar-width: thin;
`

export const SidebarHeader = styled.h1`
  font-size: 24px;
  text-align: center;
    border-bottom: 1px solid #2E1760;
`

export const SidebarSection = styled.div`

  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  padding-bottom: 20px;
border-bottom: 1px solid #2E1760;
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
