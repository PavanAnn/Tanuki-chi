import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppRoutes from './routes'

export const queryClient = new QueryClient()

function App(): JSX.Element {
  // sempre que mexer na main re-inicializar o terminal -> tipo um webpack
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </>
  )
}

export default App
