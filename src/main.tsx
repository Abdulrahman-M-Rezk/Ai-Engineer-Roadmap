import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { AppProvider } from './app/context/AppContext'
import { RouteGuard } from './app/components/RouteGuard'
import PinEntry from './app/pages/PinEntry'
import Dashboard from './app/pages/Dashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<PinEntry />} />
          <Route path="/dashboard" element={
            <RouteGuard>
              <Dashboard />
            </RouteGuard>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
)
