import { useEffect, useState } from 'react'
import { useCartStore } from './store/useCartStore'
import { STATUS, VIEW_MODES } from './constants'
import FilterBar from './components/FilterBar'
import CartList from './components/CartList'
import LoanPanel from './components/LoanPanel'
import CartForm from './components/CartForm'
import LoanForm from './components/LoanForm'
import SaleForm from './components/SaleForm'
import SalesRecords from './components/SalesRecords'
import { loadSampleData } from './utils/sampleData'

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const { fetchAll, addCart, updateCart, deleteCart, lendCart, returnCart, markAsSold, carts, activeLoans } = useCartStore()

  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST)
  const [showCartForm, setShowCartForm] = useState(false)
  const [editingCart, setEditingCart] = useState(null)
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [lendingCart, setLendingCart] = useState(null)
  const [showSaleForm, setShowSaleForm] = useState(false)
  const [sellingCart, setSellingCart] = useState(null)

  useEffect(() => {
    fetchAll()
  }, [])

  const handleAddCart = () => {
    setEditingCart(null)
    setShowCartForm(true)
  }

  const handleEditCart = (cart) => {
    setEditingCart(cart)
    setShowCartForm(true)
  }

  const handleSubmitCart = async (data) => {
    try {
      if (editingCart) {
        await updateCart(editingCart.id, data)
      } else {
        await addCart(data)
      }
      setShowCartForm(false)
      setEditingCart(null)
    } catch (e) {
      alert('保存失败：' + e.message)
    }
  }

  const handleDeleteCart = (cart) => {
    if (confirm(`确定要删除《${cart.name}》吗？`)) {
      deleteCart(cart.id)
    }
  }

  const handleLendCart = (cart) => {
    setLendingCart(cart)
    setShowLoanForm(true)
  }

  const handleSubmitLoan = async (data) => {
    try {
      await lendCart({
        cartId: lendingCart.id,
        ...data,
      })
      setShowLoanForm(false)
      setLendingCart(null)
    } catch (e) {
      alert('登记失败：' + e.message)
    }
  }

  const handleReturnCart = (loanId, cartId) => {
    if (confirm('确认已归还？')) {
      returnCart(loanId, cartId)
    }
  }

  const handleSellCart = (cart) => {
    setSellingCart(cart)
    setShowSaleForm(true)
  }

  const handleSubmitSale = async (saleData) => {
    try {
      await markAsSold(sellingCart.id, saleData)
      setShowSaleForm(false)
      setSellingCart(null)
    } catch (e) {
      alert('登记失败：' + e.message)
    }
  }

  const handleLoadSample = async () => {
    if (confirm('加载示例数据？会添加一些示例卡带，已有数据不会被覆盖。')) {
      try {
        await loadSampleData()
        await fetchAll()
        alert('示例数据已加载！')
      } catch (e) {
        alert('加载失败：' + e.message)
      }
    }
  }

  const ownedCount = carts.filter(c => c.status === STATUS.OWNED).length
  const lentCount = activeLoans.length
  const soldCount = carts.filter(c => c.status === STATUS.SOLD).length

  return (
    <div className="app">
      <header className="header">
        <h1>🎮 老卡带收藏册</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleLoadSample}>
            加载示例
          </button>
          <button className="btn btn-primary" onClick={handleAddCart}>
            + 添加卡带
          </button>
        </div>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-number">{carts.length}</div>
          <div className="stat-label">总收藏</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{ownedCount}</div>
          <div className="stat-label">在库</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#b9770e' }}>{lentCount}</div>
          <div className="stat-label">借出中</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#7f8c8d' }}>{soldCount}</div>
          <div className="stat-label">已出掉</div>
        </div>
      </div>

      <div className="view-tabs">
        <button
          className={`view-tab ${viewMode === VIEW_MODES.LIST ? 'active' : ''}`}
          onClick={() => setViewMode(VIEW_MODES.LIST)}
        >
          卡带列表
        </button>
        <button
          className={`view-tab ${viewMode === VIEW_MODES.SALES ? 'active' : ''}`}
          onClick={() => setViewMode(VIEW_MODES.SALES)}
        >
          售出记录
        </button>
      </div>

      <div className="main-layout">
        <aside className="sidebar">
          <FilterBar />
          <LoanPanel />
        </aside>

        <main className="content">
          {viewMode === VIEW_MODES.LIST ? (
            <CartList
              onEditCart={handleEditCart}
              onLendCart={handleLendCart}
              onReturnCart={handleReturnCart}
              onSellCart={handleSellCart}
              onDeleteCart={handleDeleteCart}
            />
          ) : (
            <SalesRecords />
          )}
        </main>
      </div>

      {showCartForm && (
        <Modal
          title={editingCart ? '编辑卡带' : '添加卡带'}
          onClose={() => { setShowCartForm(false); setEditingCart(null) }}
        >
          <CartForm
            cart={editingCart}
            onSubmit={handleSubmitCart}
            onCancel={() => { setShowCartForm(false); setEditingCart(null) }}
          />
        </Modal>
      )}

      {showLoanForm && lendingCart && (
        <Modal
          title="登记借出"
          onClose={() => { setShowLoanForm(false); setLendingCart(null) }}
        >
          <LoanForm
            cart={lendingCart}
            onSubmit={handleSubmitLoan}
            onCancel={() => { setShowLoanForm(false); setLendingCart(null) }}
          />
        </Modal>
      )}

      {showSaleForm && sellingCart && (
        <Modal
          title="登记售出"
          onClose={() => { setShowSaleForm(false); setSellingCart(null) }}
        >
          <SaleForm
            cart={sellingCart}
            onSubmit={handleSubmitSale}
            onCancel={() => { setShowSaleForm(false); setSellingCart(null) }}
          />
        </Modal>
      )}
    </div>
  )
}
