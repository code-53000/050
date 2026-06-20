import { PLATFORMS, CONDITIONS, STATUS_LABELS, STATUS } from '../constants'
import { useCartStore } from '../store/useCartStore'

export default function CartCard({ cart, onEdit, onLend, onReturn, onSell, onDelete }) {
  const getActiveLoanForCart = useCartStore(s => s.getActiveLoanForCart)
  const activeLoan = getActiveLoanForCart(cart.id)

  const platformLabel = PLATFORMS.find(p => p.value === cart.platform)?.label || cart.platform
  const conditionLabel = CONDITIONS.find(c => c.value === cart.condition)?.label || cart.condition
  const statusLabel = STATUS_LABELS[cart.status] || cart.status

  return (
    <div className={`cart-card status-${cart.status}`}>
      <div className="cart-card-header">
        <div className="cart-name">{cart.name}</div>
        <span className={`cart-status status-${cart.status}`}>{statusLabel}</span>
      </div>

      <div className="cart-meta">
        <p>平台：{platformLabel}</p>
        <p>成色：{conditionLabel}</p>
        {activeLoan && (
          <p style={{ color: '#b9770e' }}>
            借给：{activeLoan.borrower}
          </p>
        )}
      </div>

      <div className="cart-tags">
        {cart.hasBox && <span className="tag tag-has-box">带原盒</span>}
        {cart.hasManual && <span className="tag tag-has-box">带说明书</span>}
      </div>

      {cart.note && (
        <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
          {cart.note}
        </p>
      )}

      <div className="cart-actions">
        <button className="btn btn-secondary btn-small" onClick={onEdit}>
          编辑
        </button>
        {cart.status === STATUS.OWNED && (
          <>
            <button className="btn btn-primary btn-small" onClick={onLend}>
              借出
            </button>
            <button className="btn btn-secondary btn-small" onClick={onSell}>
              标记出掉
            </button>
          </>
        )}
        {cart.status === STATUS.LENT && activeLoan && (
          <button className="btn btn-primary btn-small" onClick={() => onReturn(activeLoan.id)}>
            归还
          </button>
        )}
        <button className="btn btn-danger btn-small" onClick={onDelete}>
          删除
        </button>
      </div>
    </div>
  )
}
