export type CartItem = {
  productId: number
  slug: string
  name: string
  price: number // in satang
  image: string
  qty: number
  stock: number
}

export function useCart() {
  const cart = useState<CartItem[]>('cart', () => [])

  // persist to localStorage
  if (import.meta.client) {
    const stored = localStorage.getItem('mini-cart')
    if (stored && cart.value.length === 0) {
      try { cart.value = JSON.parse(stored) } catch {}
    }
    watch(cart, v => localStorage.setItem('mini-cart', JSON.stringify(v)), { deep: true })
  }

  const cartCount = computed(() => cart.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0))
  const shippingFee = 5000 // will be fetched from settings later
  const total = computed(() => subtotal.value + (cart.value.length ? shippingFee : 0))

  function addToCart(item: Omit<CartItem, 'qty'> & { qty?: number }) {
    const existing = cart.value.find(c => c.productId === item.productId)
    const qty = item.qty ?? 1
    if (existing) {
      existing.qty = Math.min(existing.stock, existing.qty + qty)
    } else {
      cart.value.push({ ...item, qty })
    }
  }
  function updateQty(productId: number, qty: number) {
    const it = cart.value.find(c => c.productId === productId)
    if (!it) return
    if (qty <= 0) removeFromCart(productId)
    else it.qty = Math.min(it.stock, qty)
  }
  function removeFromCart(productId: number) {
    cart.value = cart.value.filter(c => c.productId !== productId)
  }
  function clearCart() {
    cart.value = []
    if (import.meta.client) localStorage.removeItem('mini-cart')
  }

  return { cart, cartCount, subtotal, shippingFee, total, addToCart, updateQty, removeFromCart, clearCart }
}

export function formatPrice(satang: number): string {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(satang / 100)
}
