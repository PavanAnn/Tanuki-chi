// theme.ts
export const lightTheme = {
  token: {
    colorPrimary: '#1d4ed8',
    colorSecondary: '#f72585'
  },
  colors: {
    primary: '#e0e7ff',
    secondary: '#e0e7ff',
    bg: '#f0f5f9',
    unselected: '#433D8B',
    sidebarBg: '#ffffff',
    sidebarText: '#4A4A4A',
    hover: '#f5f5f5',
    active: '#e0e7ff',
    activeText: '#1d4ed8',
    cardBg: '#ffffff',
    textPrimary: '#1a1a1a',
    textSecondary: '#5f6368',
    border: '#e8eaed',
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    gradient: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)'
  }
}

export const darkTheme = {
  token: {
    colorPrimary: '#4c6ef5',
    colorSecondary: '#f72585'
  },
  colors: {
    primary: '#364fc7',
    secondary: '#4c6ef5',
    bg: '#1a1b1e',
    unselected: '#7c7ea3',
    sidebarBg: '#25262b',
    sidebarText: '#c1c2c5',
    hover: '#2c2e33',
    active: '#364fc7',
    activeText: '#4c6ef5',
    cardBg: '#25262b',
    textPrimary: '#e9ecef',
    textSecondary: '#a6a7ab',
    border: '#373a40',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    gradient: 'linear-gradient(180deg, #25262b 0%, #1a1b1e 100%)'
  }
}

export const getTheme = (mode: 'light' | 'dark') => mode === 'light' ? lightTheme : darkTheme

export const getStyledTheme = (mode: 'light' | 'dark') => ({
  colors: mode === 'light' ? lightTheme.colors : darkTheme.colors
})
