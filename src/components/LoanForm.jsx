import { useState } from 'react'

export default function LoanForm({ cart, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    borrower: '',
    lendDate: new Date().toISOString().split('T')[0],
    note: '',
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.borrower.trim()) {
      alert('请输入借用人')
      return
    }
    onSubmit({
      ...formData,
      lendDate: new Date(formData.lendDate).toISOString(),
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>卡带</label>
        <input type="text" value={cart.name} disabled />
      </div>

      <div className="form-group">
        <label>借给谁 *</label>
        <input
          type="text"
          value={formData.borrower}
          onChange={e => handleChange('borrower', e.target.value)}
          placeholder="朋友的名字"
        />
      </div>

      <div className="form-group">
        <label>借出日期</label>
        <input
          type="date"
          value={formData.lendDate}
          onChange={e => handleChange('lendDate', e.target.value)}
        />
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
          确认借出
        </button>
      </div>
    </form>
  )
}
