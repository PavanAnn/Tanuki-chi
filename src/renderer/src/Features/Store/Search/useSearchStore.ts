import { create } from 'zustand'

interface SearchState {
  searchTerm: string
  setSearchTerm: (term: string) => void
  data: any
  setData: (data: any) => void
  isFetching: boolean
  setIsFetching: (isFetching: boolean) => void
  clear: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  data: null,
  setData: (data) => set({ data }),

  isFetching: false,
  setIsFetching: (isFetching) => set({ isFetching }),

  clear: () =>
    set({
      searchTerm: '',
      data: null,
      isFetching: false
    })
}))
