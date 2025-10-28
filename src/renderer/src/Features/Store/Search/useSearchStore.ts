import { create } from 'zustand'

interface SearchState {
  searchTerm: string
  setSearchTerm: (term: string) => void
  data: any
  setData: (data: any) => void
  loadingProviders: Set<string>
  providerOrder: string[]
  setLoadingProviders: (providers: Set<string>) => void
  setProviderOrder: (order: string[]) => void
  addLoadingProvider: (provider: string) => void
  removeLoadingProvider: (provider: string) => void
  updateProviderData: (provider: string, data: any) => void
  clear: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  data: null,
  setData: (data) => set({ data }),

  loadingProviders: new Set<string>(),
  providerOrder: [],
  setLoadingProviders: (providers) => set({ loadingProviders: providers }),
  setProviderOrder: (order) => set({ providerOrder: order }),
  
  addLoadingProvider: (provider) =>
    set((state) => ({
      loadingProviders: new Set([...state.loadingProviders, provider])
    })),
  
  removeLoadingProvider: (provider) =>
    set((state) => {
      const newSet = new Set(state.loadingProviders)
      newSet.delete(provider)
      return { loadingProviders: newSet }
    }),

  updateProviderData: (provider, providerData) =>
    set((state) => {
      const currentData = Array.isArray(state.data) ? state.data : []
      const existingIndex = currentData.findIndex(
        (entry) => Object.keys(entry)[0] === provider
      )

      if (existingIndex >= 0) {
        // Update existing provider data
        const updated = [...currentData]
        updated[existingIndex] = { [provider]: providerData }
        return { data: updated }
      } else {
        // Add new provider data in the order based on providerOrder
        const newData = [...currentData, { [provider]: providerData }]
        
        // Sort by the original provider order
        newData.sort((a, b) => {
          const providerA = Object.keys(a)[0]
          const providerB = Object.keys(b)[0]
          const indexA = state.providerOrder.indexOf(providerA)
          const indexB = state.providerOrder.indexOf(providerB)
          
          // If both are in providerOrder, sort by that order
          if (indexA !== -1 && indexB !== -1) return indexA - indexB
          // If only one is in providerOrder, it comes first
          if (indexA !== -1) return -1
          if (indexB !== -1) return 1
          // Otherwise maintain current order
          return 0
        })
        
        return { data: newData }
      }
    }),

  clear: () =>
    set({
      searchTerm: '',
      data: null,
      loadingProviders: new Set<string>(),
      providerOrder: []
    })
}))
