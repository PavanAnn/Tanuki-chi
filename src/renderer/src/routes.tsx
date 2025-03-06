// src/routes.ts
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DefaultLayout from './Layout'
import { MangaDetail } from './pages/MangaDetail'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<MangaDetail />} />
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
