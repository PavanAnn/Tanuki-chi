import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from './routes'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { getTheme, getStyledTheme } from './Layout/theme'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { GlobalStyles } from './Layout/GlobalStyles'

export const queryClient = new QueryClient()

function AppContent(): JSX.Element {
  const { mode } = useTheme()
  const customTheme = getTheme(mode)
  const styledTheme = getStyledTheme(mode)

  const antThemeConfig = {
    ...customTheme,
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm
  }

  return (
    <ConfigProvider theme={antThemeConfig}>
      <StyledThemeProvider theme={styledTheme}>
        <GlobalStyles />
        <AppRoutes />
      </StyledThemeProvider>
    </ConfigProvider>
  )
}

function App(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
