import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { formatINR } from '../utils/format'

export default function UpiQrPayment({ amount, orderId, onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false)
  const [showUpiApps, setShowUpiApps] = useState(false)

  // UPI Payment String Format
  const upiId = import.meta.env.VITE_UPI_ID || 'merchant@paytm'
  const merchantName = import.meta.env.VITE_UPI_NAME || 'Eco Basket'
  const transactionNote = import.meta.env.VITE_UPI_NOTE || 'Order Payment'
  const customQrImageRaw = (import.meta.env.VITE_UPI_QR_IMAGE || '').trim()
  const customQrImage = customQrImageRaw
    ? (/^(https?:)?\/\//.test(customQrImageRaw)
      ? customQrImageRaw
      : `/${customQrImageRaw.replace(/^\/+/, '')}`)
    : ''
  const [showGeneratedQr, setShowGeneratedQr] = useState(!customQrImage)
  
  // Generate UPI string
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`

  const upiPayload = upiString.replace('upi://pay?', '')
  const upiApps = [
    {
      key: 'phonepe',
      name: 'PhonePe',
      deeplink: `phonepe://pay?${upiPayload}`,
    },
    {
      key: 'gpay',
      name: 'Google Pay',
      deeplink: `tez://upi/pay?${upiPayload}`,
    },
    {
      key: 'paytm',
      name: 'Paytm',
      deeplink: `paytmmp://pay?${upiPayload}`,
    },
    {
      key: 'bhim',
      name: 'BHIM',
      deeplink: `bhim://upi/pay?${upiPayload}`,
    },
  ]

  const openSpecificUpiApp = (deeplink) => {
    // Direct deep-link redirect to selected UPI app.
    window.location.assign(deeplink)
  }

  const handleOpenUpi = () => {
    setShowUpiApps(true)
    // Primary deep-link API for UPI-capable devices.
    window.location.href = upiString
  }

  const handleConfirm = async () => {
    setLoading(true)
    // Simulate verification - In production, verify with your backend
    setTimeout(() => {
      onSuccess({
        razorpay_payment_id: `test_payment_${Date.now()}`,
        razorpay_signature: 'test_signature',
        razorpay_order_id: orderId,
      })
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Complete Online Payment</h2>
            <p className="text-sm text-gray-600 mt-1">Scan the QR with any UPI app and confirm your payment below.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs uppercase tracking-wide text-emerald-700">Amount to pay</div>
                <div className="text-3xl font-bold text-emerald-700">{formatINR(amount)}</div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-600">UPI ID</span>
                  <span className="font-semibold text-gray-900 break-all text-right">{upiId}</span>
                </div>
                <a
                  href={upiString}
                  onClick={(e) => {
                    e.preventDefault()
                    handleOpenUpi()
                  }}
                  className="block text-center w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold"
                >
                  Open UPI App
                </a>

                {showUpiApps && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {upiApps.map((app) => (
                      <button
                        key={app.key}
                        type="button"
                        onClick={() => openSpecificUpiApp(app.deeplink)}
                        className="py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs font-semibold"
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3 border border-gray-200">
                1. Scan QR in PhonePe, GPay, Paytm or BHIM. 2. Confirm amount {formatINR(amount)}. 3. Tap "Confirm Payment" below.
              </div>
            </div>

            <div>
              <div className="bg-white p-5 rounded-xl border-4 border-emerald-500 flex items-center justify-center min-h-[260px]">
                {showGeneratedQr ? (
                  <QRCodeSVG
                    value={upiString}
                    size={220}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <img
                    src={customQrImage}
                    alt="UPI QR code"
                    className="w-[220px] h-[220px] object-contain"
                    onError={() => setShowGeneratedQr(true)}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
