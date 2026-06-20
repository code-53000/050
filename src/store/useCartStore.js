import { create } from 'zustand'
import {
  getAllCarts,
  addCart as dbAddCart,
  updateCart as dbUpdateCart,
  deleteCart as dbDeleteCart,
} from '../db/carts'
import {
  getActiveLoans,
  addLoan as dbAddLoan,
  returnLoan as dbReturnLoan,
  getLoansByCartId,
} from '../db/loans'
import { STATUS } from '../constants'

export const useCartStore = create((set, get) => ({
  carts: [],
  activeLoans: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null })
    try {
      const [carts, loans] = await Promise.all([
        getAllCarts(),
        getActiveLoans(),
      ])
      set({ carts, activeLoans: loans })
    } catch (e) {
      set({ error: e.message })
    } finally {
      set({ loading: false })
    }
  },

  addCart: async (cartData) => {
    set({ error: null })
    try {
      const id = await dbAddCart(cartData)
      const newCart = { ...cartData, id }
      set(state => ({ carts: [...state.carts, newCart] }))
      return id
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  updateCart: async (id, updates) => {
    set({ error: null })
    try {
      const updated = await dbUpdateCart(id, updates)
      set(state => ({
        carts: state.carts.map(c => (c.id === id ? updated : c)),
      }))
      return updated
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  deleteCart: async (id) => {
    set({ error: null })
    try {
      await dbDeleteCart(id)
      set(state => ({
        carts: state.carts.filter(c => c.id !== id),
      }))
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  lendCart: async ({ cartId, borrower, lendDate, note }) => {
    set({ error: null })
    try {
      const loanId = await dbAddLoan({ cartId, borrower, lendDate, note })
      const updatedCart = await dbUpdateCart(cartId, { status: STATUS.LENT })
      const loan = {
        id: loanId,
        cartId,
        borrower,
        lendDate: lendDate || new Date().toISOString(),
        returned: false,
        note: note || '',
      }
      set(state => ({
        carts: state.carts.map(c => (c.id === cartId ? updatedCart : c)),
        activeLoans: [...state.activeLoans, loan],
      }))
      return loanId
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  returnCart: async (loanId, cartId) => {
    set({ error: null })
    try {
      await dbReturnLoan(loanId)
      const updatedCart = await dbUpdateCart(cartId, { status: STATUS.OWNED })
      set(state => ({
        carts: state.carts.map(c => (c.id === cartId ? updatedCart : c)),
        activeLoans: state.activeLoans.filter(l => l.id !== loanId),
      }))
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  markAsSold: async (cartId) => {
    return get().updateCart(cartId, { status: STATUS.SOLD })
  },

  getLoansForCart: async (cartId) => {
    return getLoansByCartId(cartId)
  },

  getActiveLoanForCart: (cartId) => {
    return get().activeLoans.find(l => l.cartId === cartId && !l.returned)
  },
}))
