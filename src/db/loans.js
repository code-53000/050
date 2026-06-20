import { getDb, STORES } from './index'

export async function getAllLoans() {
  const db = await getDb()
  return db.getAll(STORES.LOANS)
}

export async function getActiveLoans() {
  const db = await getDb()
  const all = await db.getAll(STORES.LOANS)
  return all.filter(loan => !loan.returned)
}

export async function getLoansByCartId(cartId) {
  const db = await getDb()
  const all = await db.getAllFromIndex(STORES.LOANS, 'cartId', cartId)
  return all.sort((a, b) => new Date(b.lendDate) - new Date(a.lendDate))
}

export async function addLoan(loan) {
  const db = await getDb()
  const id = await db.add(STORES.LOANS, {
    cartId: loan.cartId,
    borrower: loan.borrower,
    lendDate: loan.lendDate || new Date().toISOString(),
    returned: false,
    returnDate: null,
    note: loan.note || '',
    createdAt: new Date().toISOString(),
  })
  return id
}

export async function returnLoan(loanId) {
  const db = await getDb()
  const existing = await db.get(STORES.LOANS, loanId)
  if (!existing) return null
  const updated = {
    ...existing,
    returned: true,
    returnDate: new Date().toISOString(),
  }
  await db.put(STORES.LOANS, updated)
  return updated
}

export async function deleteLoan(id) {
  const db = await getDb()
  await db.delete(STORES.LOANS, id)
}

export async function returnLoansByCartId(cartId) {
  const db = await getDb()
  const loans = await db.getAllFromIndex(STORES.LOANS, 'cartId', cartId)
  const active = loans.filter(l => !l.returned)
  for (const loan of active) {
    await db.put(STORES.LOANS, {
      ...loan,
      returned: true,
      returnDate: new Date().toISOString(),
    })
  }
  return active
}

export async function deleteLoansByCartId(cartId) {
  const db = await getDb()
  const loans = await db.getAllFromIndex(STORES.LOANS, 'cartId', cartId)
  const tx = db.transaction(STORES.LOANS, 'readwrite')
  for (const loan of loans) {
    tx.store.delete(loan.id)
  }
  await tx.done
  return loans
}
