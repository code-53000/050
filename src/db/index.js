import { openDB } from 'idb'

const DB_NAME = 'retro-cart-db'
const DB_VERSION = 1

export const STORES = {
  CARTS: 'carts',
  LOANS: 'loans',
}

let dbPromise = null

export function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORES.CARTS)) {
          const cartStore = db.createObjectStore(STORES.CARTS, {
            keyPath: 'id',
            autoIncrement: true,
          })
          cartStore.createIndex('platform', 'platform')
          cartStore.createIndex('condition', 'condition')
          cartStore.createIndex('status', 'status')
          cartStore.createIndex('name', 'name')
        }

        if (!db.objectStoreNames.contains(STORES.LOANS)) {
          const loanStore = db.createObjectStore(STORES.LOANS, {
            keyPath: 'id',
            autoIncrement: true,
          })
          loanStore.createIndex('cartId', 'cartId')
          loanStore.createIndex('borrower', 'borrower')
          loanStore.createIndex('returned', 'returned')
          loanStore.createIndex('lendDate', 'lendDate')
        }
      },
    })
  }
  return dbPromise
}
