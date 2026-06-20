import { useCartStore } from '../store/useCartStore'

export default function LoanPanel() {
  const { activeLoans, carts, returnCart } = useCartStore()

  const getCartName = (cartId) => {
    const cart = carts.find(c => c.id === cartId)
    return cart ? cart.name : '未知卡带'
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('zh-CN')
  }

  const daysLent = (dateStr) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24))
    return diff
  }

  const sortedLoans = [...activeLoans].sort(
    (a, b) => new Date(a.lendDate) - new Date(b.lendDate)
  )

  if (activeLoans.length === 0) {
    return (
      <div className="panel">
        <h3>借出中 ({activeLoans.length})</h3>
        <p style={{ fontSize: '13px', color: '#999', textAlign: 'center', padding: '20px 0' }}>
          暂无借出记录
        </p>
      </div>
    )
  }

  return (
    <div className="panel">
      <h3>借出中 ({activeLoans.length})</h3>
      <ul className="loan-list">
        {sortedLoans.map(loan => {
          const days = daysLent(loan.lendDate)
          return (
            <li key={loan.id} className="loan-item">
              <div className="loan-item-cart">{getCartName(loan.cartId)}</div>
              <div className="loan-item-borrower">借给：{loan.borrower}</div>
              <div className="loan-item-date">
                {formatDate(loan.lendDate)} 借出 · 已 {days} 天
              </div>
              <button
                className="btn btn-primary btn-small"
                onClick={() => returnCart(loan.id, loan.cartId)}
              >
                标记归还
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
