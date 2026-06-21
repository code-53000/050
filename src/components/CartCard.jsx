import { PLATFORMS, CONDITIONS, STATUS_LABELS, STATUS, SALE_CHANNEL_LABELS } from '../constants'
import { useCartStore } from '../store/useCartStore'

function formatShortDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.getFullYear() + '/' +
    String(d.getMonth() + 1).padStart(2, '0') + '/' +
    String(d.getDate()).padStart(2, '0')
}

export default function CartCard({ cart, onEdit, onLend, onReturn, onSell, onDelete }) {
  const getActiveLoanForCart = useCartStore(s => s.getActiveLoanForCart)
  const activeLoan = getActiveLoanForCart(cart.id)

  const platformLabel = PLATFORMS.find(p => p.value === cart.platform)?.label || cart.platform
  const conditionLabel = CONDITIONS.find(c => c.value === cart.condition)?.label || cart.condition
  const statusLabel = STATUS_LABELS[cart.status] || cart.status
  const channelLabel = SALE_CHANNEL_LABELS[cart.soldChannel]

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
        {cart.status === STATUS.SOLD && (
          <>
            <p style={{ color: '#566573' }}>
              售出日期：{formatShortDate(cart.soldDate) || '未记录'}
            </p>
            {cart.soldPrice !== undefined && cart.soldPrice !== null && !isNaN(cart.soldPrice) && (
              <p style={{ color: '#27ae60', fontWeight: 600 }}>
                成交价：¥{Number(cart.soldPrice).toFixed(2)}
              </p>
            )}
            {channelLabel && (
              <p style={{ color: '#566573' }}>
                渠道：{channelLabel}
              </p>
            )}
          </>
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
      {cart.status === STATUS.SOLD && cart.soldNote && (
        <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
          售出备注：{cart.soldNote}
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
