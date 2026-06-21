import { useState } from 'react'
import { SALE_CHANNELS } from '../constants'

export default function SaleForm({ cart, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    soldDate: new Date().toISOString().split('T')[0],
    soldPrice: '',
    soldChannel: 'offline',
    soldNote: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.soldDate.trim()) {
      alert('请选择售出日期')
      return
    }
    onSubmit({
      ...formData,
      soldDate: new Date(formData.soldDate).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>卡带</label>
        <input type="text" value={cart.name} disabled />
      </div>

      <div className="form-group">
        <label>售出日期 *</label>
        <input
          type="date"
          value={formData.soldDate}
          onChange={e => handleChange('soldDate', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>成交价（元，可选）</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.soldPrice}
          onChange={e => handleChange('soldPrice', e.target.value)}
          placeholder="比如：120"
        />
      </div>

      <div className="form-group">
        <label>出售渠道</label>
        <select
          value={formData.soldChannel}
          onChange={e => handleChange('soldChannel', e.target.value)}
        >
          {SALE_CHANNELS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>备注</label>
        <textarea
          value={formData.soldNote}
          onChange={e => handleChange('soldNote', e.target.value)}
          placeholder="有什么想记的..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn btn-primary">
          确认出掉
        </button>
      </div>
    </form>
  )
}
