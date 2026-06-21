import { useMemo, useState } from 'react'
import { useCartStore } from '../store/useCartStore'
import { STATUS, SALE_CHANNEL_LABELS, PLATFORMS } from '../constants'

const SORT_OPTIONS = [
  { value: 'date-desc', label: '售出日期（最新）' },
  { value: 'date-asc', label: '售出日期（最早）' },
  { value: 'price-desc', label: '成交价（高→低）' },
  { value: 'price-asc', label: '成交价（低→高）' },
]

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.getFullYear() + '-' +
    String(d.getMonth() + 1).padStart(2, '0') + '-' +
    String(d.getDate()).padStart(2, '0')
}

function formatPrice(n) {
  if (n === undefined || n === null || isNaN(n)) return '—'
  return '¥' + Number(n).toFixed(2)
}

export default function SalesRecords() {
  const carts = useCartStore(s => s.carts)
  const [sortBy, setSortBy] = useState('date-desc')

  const soldCarts = useMemo(() => {
    const list = carts.filter(c => c.status === STATUS.SOLD)
    const sorted = [...list]

    switch (sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => {
          const ad = a.soldDate ? new Date(a.soldDate).getTime() : -1
          const bd = b.soldDate ? new Date(b.soldDate).getTime() : -1
          return bd - ad
        })
        break
      case 'date-asc':
        sorted.sort((a, b) => {
          const ad = a.soldDate ? new Date(a.soldDate).getTime() : -1
          const bd = b.soldDate ? new Date(b.soldDate).getTime() : -1
          if (ad === -1 && bd === -1) return 0
          if (ad === -1) return 1
          if (bd === -1) return -1
          return ad - bd
        })
        break
      case 'price-desc':
        sorted.sort((a, b) => {
          const ap = a.soldPrice === undefined || isNaN(a.soldPrice) ? -1 : Number(a.soldPrice)
          const bp = b.soldPrice === undefined || isNaN(b.soldPrice) ? -1 : Number(b.soldPrice)
          return bp - ap
        })
        break
      case 'price-asc':
        sorted.sort((a, b) => {
          const ap = a.soldPrice === undefined || isNaN(a.soldPrice) ? -1 : Number(a.soldPrice)
          const bp = b.soldPrice === undefined || isNaN(b.soldPrice) ? -1 : Number(b.soldPrice)
          if (ap === -1 && bp === -1) return 0
          if (ap === -1) return 1
          if (bp === -1) return -1
          return ap - bp
        })
        break
    }
    return sorted
  }, [carts, sortBy])

  const totalAmount = useMemo(() => {
    return soldCarts.reduce((sum, c) => {
      if (c.soldPrice !== undefined && !isNaN(c.soldPrice)) {
        return sum + Number(c.soldPrice)
      }
      return sum
    }, 0)
  }, [soldCarts])

  const priceRecordCount = useMemo(() => {
    return soldCarts.filter(c => c.soldPrice !== undefined && !isNaN(c.soldPrice)).length
  }, [soldCarts])

  if (soldCarts.length === 0) {
    return (
      <div className="panel">
        <div className="empty-state">
          <h3>还没有售出记录</h3>
          <p>当你把卡带标记为「已出掉」后，就会显示在这里</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sales-records">
      <div className="panel">
        <div className="sales-header">
          <h3 style={{ marginBottom: 0 }}>售出记录</h3>
          <div className="sales-sort">
            <label>排序：</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="sales-table-wrap">
          <table className="sales-table">
            <thead>
              <tr>
                <th>游戏名称</th>
                <th>平台</th>
                <th>售出日期</th>
                <th>成交价</th>
                <th>渠道</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {soldCarts.map(cart => {
                const platform = PLATFORMS.find(p => p.value === cart.platform)?.label || cart.platform
                const channel = SALE_CHANNEL_LABELS[cart.soldChannel] || '—'
                return (
                  <tr key={cart.id}>
                    <td className="sales-name">{cart.name}</td>
                    <td>{platform}</td>
                    <td>{formatDate(cart.soldDate)}</td>
                    <td className="sales-price">{formatPrice(cart.soldPrice)}</td>
                    <td>{channel}</td>
                    <td className="sales-note">{cart.soldNote || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="sales-summary">
          <div className="summary-item">
            <span className="summary-label">共售出</span>
            <span className="summary-value">{soldCarts.length} 件</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">有价格记录</span>
            <span className="summary-value">{priceRecordCount} 件</span>
          </div>
          <div className="summary-item summary-total">
            <span className="summary-label">累计收入</span>
            <span className="summary-value">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
