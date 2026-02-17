import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { WealthProvider } from './context/WealthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WealthProvider>
      <App />
    </WealthProvider>
  </React.StrictMode>,
)
