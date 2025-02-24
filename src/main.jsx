import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DEFAULT_THEME, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({})

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={DEFAULT_THEME}>
        
        <App />
      </MantineProvider>

    </QueryClientProvider>
  </StrictMode>,
)
