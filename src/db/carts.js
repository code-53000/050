import { getDb, STORES } from './index'

export async function getAllCarts() {
  const db = await getDb()
  return db.getAll(STORES.CARTS)
}

export async function getCartById(id) {
  const db = await getDb()
  return db.get(STORES.CARTS, id)
}

export async function addCart(cart) {
  const db = await getDb()
  const id = await db.add(STORES.CARTS, {
    name: cart.name,
    platform: cart.platform,
    condition: cart.condition,
    hasBox: !!cart.hasBox,
    hasManual: !!cart.hasManual,
    status: cart.status || 'owned',
    note: cart.note || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
  return id
}

export async function updateCart(id, updates) {
  const db = await getDb()
  const existing = await db.get(STORES.CARTS, id)
  if (!existing) return null
  const updated = {
    ...existing,
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  }
  await db.put(STORES.CARTS, updated)
  return updated
}

export async function deleteCart(id) {
  const db = await getDb()
  await db.delete(STORES.CARTS, id)
}
