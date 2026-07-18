import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, CssVarsProvider, extendTheme } from '@mui/joy'
import './index.css'
import App from './App.jsx'

const theme = extendTheme({
  fontFamily: {
    body: 'Inter, ui-sans-serif, system-ui, sans-serif',
    display: 'Inter, ui-sans-serif, system-ui, sans-serif',
    code: 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace',
  },
  radius: {
    xs: '6px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#2563EB',
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554',
        },
        danger: {
          500: '#DC2626',
          600: '#B91C1C',
        },
        background: {
          body: '#F8FAFC',
          surface: '#FFFFFF',
          popup: '#FFFFFF',
          level1: '#F1F5F9',
          level2: '#E5E7EB',
        },
        text: {
          primary: '#111827',
          secondary: '#64748B',
          tertiary: '#94A3B8',
        },
        neutral: {
          outlinedBorder: '#E5E7EB',
          softBg: '#F8FAFC',
          softHoverBg: '#F1F5F9',
          plainHoverBg: '#F1F5F9',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          50: '#172554',
          100: '#1E3A8A',
          200: '#1E40AF',
          300: '#1D4ED8',
          400: '#3B82F6',
          500: '#60A5FA',
          600: '#93C5FD',
          700: '#BFDBFE',
          800: '#DBEAFE',
          900: '#EFF6FF',
        },
        danger: {
          500: '#F87171',
          600: '#EF4444',
        },
        background: {
          body: '#0B1120',
          surface: '#111827',
          popup: '#111827',
          level1: '#1F2937',
          level2: '#374151',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#CBD5E1',
          tertiary: '#94A3B8',
        },
        neutral: {
          outlinedBorder: '#263244',
          softBg: '#182235',
          softHoverBg: '#233047',
          plainHoverBg: '#182235',
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 700,
          transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease',
          boxShadow: 'none',
        },
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    JoyTextarea: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider theme={theme} defaultMode="light" modeStorageKey="nexus-color-scheme">
      <CssBaseline />
      <App />
    </CssVarsProvider>
  </StrictMode>,
)
