import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  platform: 'all',
  condition: 'all',
  status: 'all',
  searchText: '',

  setPlatform: (platform) => set({ platform }),
  setCondition: (condition) => set({ condition }),
  setStatus: (status) => set({ status }),
  setSearchText: (searchText) => set({ searchText }),

  resetFilters: () => set({
    platform: 'all',
    condition: 'all',
    status: 'all',
    searchText: '',
  }),
}))

export function filterCarts(carts, filters) {
  return carts.filter(cart => {
    if (filters.platform !== 'all' && cart.platform !== filters.platform) return false
    if (filters.condition !== 'all' && cart.condition !== filters.condition) return false
    if (filters.status !== 'all' && cart.status !== filters.status) return false
    if (filters.searchText) {
      const text = filters.searchText.toLowerCase()
      if (!cart.name.toLowerCase().includes(text)) return false
    }
    return true
  })
}
