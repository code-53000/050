import { useState, useEffect } from 'react'
import { PLATFORMS, CONDITIONS, STATUS, STATUS_LABELS } from '../constants'

export default function CartForm({ cart, onSubmit, onCancel }) {
  const isEditing = !!cart

  const [formData, setFormData] = useState({
    name: '',
    platform: 'fc',
    condition: 'good',
    hasBox: false,
    hasManual: false,
    status: STATUS.OWNED,
    note: '',
  })

  useEffect(() => {
    if (cart) {
      setFormData({
        name: cart.name || '',
        platform: cart.platform || 'fc',
        condition: cart.condition || 'good',
        hasBox: !!cart.hasBox,
        hasManual: !!cart.hasManual,
        status: cart.status || STATUS.OWNED,
        note: cart.note || '',
      })
    }
  }, [cart])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('请输入游戏名称')
      return
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>游戏名称 *</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
          placeholder="比如：魂斗罗"
        />
      </div>

      <div className="form-group">
        <label>平台</label>
        <select
          value={formData.platform}
          onChange={e => handleChange('platform', e.target.value)}
        >
          {PLATFORMS.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>成色</label>
        <select
          value={formData.condition}
          onChange={e => handleChange('condition', e.target.value)}
        >
          {CONDITIONS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>状态</label>
        <select
          value={formData.status}
          onChange={e => handleChange('status', e.target.value)}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="form-checkbox">
        <input
          type="checkbox"
          id="hasBox"
          checked={formData.hasBox}
          onChange={e => handleChange('hasBox', e.target.checked)}
        />
        <label htmlFor="hasBox">带原包装盒</label>
      </div>

      <div className="form-checkbox">
        <input
          type="checkbox"
          id="hasManual"
          checked={formData.hasManual}
          onChange={e => handleChange('hasManual', e.target.checked)}
        />
        <label htmlFor="hasManual">带说明书</label>
      </div>

      <div className="form-group">
        <label>备注</label>
        <textarea
          value={formData.note}
          onChange={e => handleChange('note', e.target.value)}
          placeholder="有什么想记的..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          取消
        </button>
        <button type="submit" className="btn btn-primary">
          {isEditing ? '保存修改' : '添加卡带'}
        </button>
      </div>
    </form>
  )
}
