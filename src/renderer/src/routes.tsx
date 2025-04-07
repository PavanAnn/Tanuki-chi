// src/routes.ts
import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DefaultLayout from './Layout'
import { MangaDetail } from './pages/MangaDetail'
import { Bookmarks } from './pages/Bookmarks'
import { SharePage } from './pages/Share'

const AppRoutes: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<MangaDetail />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/share" element={<SharePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes
