import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../state/AuthContext'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function Home() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/products')
        setProducts(res.data)
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const addToCart = async (productId, qty = 1) => {
    if (!token) return toast.error('Please sign in to add to cart')
    try {
      await api.post('/cart/add', { productId, qty }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(`Added ${qty} item${qty > 1 ? 's' : ''} to cart`)
    } catch (err) {
      console.error('Add to cart error:', err)
      toast.error(err?.response?.data?.message || 'Failed to add to cart')
    }
  }

  const buyNow = (productId, qty = 1) => {
    if (!token) {
      toast.error('Please sign in to continue')
      navigate('/signin')
      return
    }
    navigate(`/checkout?buyNow=${productId}&qty=${qty}`)
  }

  if (loading) return <p className="text-gray-600">Loading...</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <section className="hero-banner rounded-3xl text-white p-6 md:p-10 flex items-center">
        <div className="max-w-2xl">
          <p className="hero-chip">Daily essentials with faster checkout</p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-3">Fresh groceries with Atlas-backed reliability and instant Buy Now flow.</h1>
          <p className="mt-3 text-emerald-50 max-w-xl">Choose quantity on every item, order in one click, and pay online with UPI QR or cash on delivery.</p>
          <a href="#products" className="btn btn-outline mt-5 bg-white/10 border-white text-white hover:bg-white/20">Shop now</a>
        </div>
      </section>

      <section id="products">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Popular products</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(p => (
            <ProductCard key={p._id} product={p} onAdd={addToCart} onBuyNow={buyNow} />
          ))}
        </div>
      </section>
    </div>
  )
}
