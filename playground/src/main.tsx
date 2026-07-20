import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DialogProvider } from './components/ui/dialog-manager/dialog-provider'
import { SidebarProvider } from './components/ui/sidebar-manager/sidebar-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DialogProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </DialogProvider>
  </StrictMode>,
)

