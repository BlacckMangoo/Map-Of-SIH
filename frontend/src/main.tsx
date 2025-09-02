import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LandingPage from './pages/landingPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ShortlistProvider } from './contexts/ShortlistProvider'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShortlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<App />} />
        </Routes>
      </BrowserRouter>
    </ShortlistProvider>
  </StrictMode>,
)
