import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from './routes'
import { ConfigProvider } from 'antd'
import { styledTheme, theme } from './Layout/theme'
import { ThemeProvider } from 'styled-components'

export const queryClient = new QueryClient()

function App(): JSX.Element {
  // sempre que mexer na main re-inicializar o terminal -> tipo um webpack
  return (
    <>
      <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <ThemeProvider theme={styledTheme}>
        <AppRoutes />
        </ThemeProvider>
      </ConfigProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
