import { useState } from 'react'
import { formatINR } from '../utils/format'

export default function ProductCard({ product, onAdd, onBuyNow }) {
  const [qty, setQty] = useState(1)

  const increase = () => setQty((prev) => prev + 1)
  const decrease = () => setQty((prev) => Math.max(1, prev - 1))

  return (
    <div className="card product-card group">
      <div className="aspect-[4/3] bg-gray-100 rounded-t-xl overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No image</div>
        )}
      </div>
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
          <span className="text-emerald-700 font-semibold">{formatINR(product.price)}</span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mt-1 min-h-[2.5rem]">{product.description}</p>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-gray-500">Quantity</span>
          <div className="quantity-picker">
            <button type="button" onClick={decrease} aria-label="Decrease quantity">-</button>
            <span>{qty}</span>
            <button type="button" onClick={increase} aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="btn btn-outline w-full" onClick={() => onAdd(product._id, qty)}>Add to cart</button>
          <button className="btn btn-primary w-full" onClick={() => onBuyNow(product._id, qty)}>Buy now</button>
        </div>
      </div>
    </div>
  )
}
