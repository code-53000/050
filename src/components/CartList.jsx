import CartCard from './CartCard'
import { useCartStore } from '../store/useCartStore'
import { useFilterStore, filterCarts } from '../store/useFilterStore'

export default function CartList({
  onEditCart,
  onLendCart,
  onReturnCart,
  onSellCart,
  onDeleteCart,
}) {
  const carts = useCartStore(s => s.carts)
  const filters = useFilterStore()

  const filteredCarts = filterCarts(carts, filters)

  if (filteredCarts.length === 0) {
    return (
      <div className="panel">
        <div className="empty-state">
          <h3>还没有卡带</h3>
          <p>点击"添加卡带"开始记录你的收藏吧</p>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-grid">
      {filteredCarts.map(cart => (
        <CartCard
          key={cart.id}
          cart={cart}
          onEdit={() => onEditCart(cart)}
          onLend={() => onLendCart(cart)}
          onReturn={(loanId) => onReturnCart(loanId, cart.id)}
          onSell={() => onSellCart(cart)}
          onDelete={() => onDeleteCart(cart)}
        />
      ))}
    </div>
  )
}
