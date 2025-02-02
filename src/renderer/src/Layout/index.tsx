// src/components/Layout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { LayoutContainer, MainContent } from './styles'
import Header from './Header'

const DefaultLayout: React.FC = () => {

  
  return (
    <LayoutContainer>
      <Sidebar />
      <Header />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutContainer>
  )
}

export default DefaultLayout
