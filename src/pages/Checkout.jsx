import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, CreditCard, Banknote, Building } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore, useAuthStore } from '../store/useStore'
import { ordersAPI } from '../services/api'
import { formatPrice } from '../utils/helpers'

const steps = ['Information', 'Shipping', 'Payment']

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    shippingMethod: 'standard',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    agreeTerms: false
  })

  const subtotal = getTotal()
  const shipping = formData.shippingMethod === 'express' ? 3000 : (subtotal >= 50000 ? 0 : 1500)
  const total = subtotal + shipping

  // Redirect if cart is empty
  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
    value = value.match(/.{1,4}/g)?.join(' ') || value
    setFormData(prev => ({ ...prev, cardNumber: value }))
  }

  const handleCardExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setFormData(prev => ({ ...prev, cardExpiry: value }))
  }

  const validateStep = (step) => {
    if (step === 0) {
      if (!formData.email || !formData.phone || !formData.firstName || !formData.lastName || !formData.address || !formData.city) {
        toast.error('Please fill in all required fields')
        return false
      }
    }
    if (step === 2) {
      if (!formData.agreeTerms) {
        toast.error('Please agree to the terms and conditions')
        return false
      }
      if (formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)) {
        toast.error('Please fill in card details')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 2))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setLoading(true)
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image
        })),
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        email: formData.email,
        payment_method: formData.paymentMethod,
        shipping_method: formData.shippingMethod
      }

      const order = await ordersAPI.create(orderData)
      clearCart()
      navigate(`/order-confirmation/${order.order_number}`)
    } catch (error) {
      console.error('Order error:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-[110px] min-h-screen bg-background">
      {/* Steps */}
      <div className="border-b bg-white">
        <div className="container py-6">
          <div className="flex items-center justify-center gap-8">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border ${
                  index < currentStep 
                    ? 'bg-secondary border-secondary text-primary' 
                    : index === currentStep 
                      ? 'bg-primary border-primary text-white' 
                      : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? <Check size={14} /> : index + 1}
                </span>
                <span className={`text-sm ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-2 ${index < currentStep ? 'bg-secondary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12">
          {/* Form */}
          <div>
            {/* Step 1: Information */}
            {currentStep === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display text-2xl mb-6">Contact Information</h2>
                <div className="grid gap-4 mb-8">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address *"
                    className="input"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number *"
                    className="input"
                    required
                  />
                </div>

                <h2 className="font-display text-2xl mb-6">Shipping Address</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name *"
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name *"
                      className="input"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address *"
                    className="input"
                    required
                  />
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className="input"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City *"
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                      className="input"
                    />
                  </div>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="UAE">United Arab Emirates</option>
                    <option value="UK">United Kingdom</option>
                    <option value="USA">United States</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Shipping */}
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display text-2xl mb-6">Shipping Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${formData.shippingMethod === 'standard' ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="shippingMethod" value="standard" checked={formData.shippingMethod === 'standard'} onChange={handleChange} className="sr-only" />
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.shippingMethod === 'standard' ? 'border-primary' : 'border-gray-300'}`}>
                      {formData.shippingMethod === 'standard' && <span className="w-3 h-3 rounded-full bg-primary" />}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">Standard Shipping</p>
                      <p className="text-sm text-gray-500">3-5 business days</p>
                    </div>
                    <span>{subtotal >= 50000 ? 'FREE' : formatPrice(1500)}</span>
                  </label>
                  <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${formData.shippingMethod === 'express' ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="shippingMethod" value="express" checked={formData.shippingMethod === 'express'} onChange={handleChange} className="sr-only" />
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.shippingMethod === 'express' ? 'border-primary' : 'border-gray-300'}`}>
                      {formData.shippingMethod === 'express' && <span className="w-3 h-3 rounded-full bg-primary" />}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">Express Shipping</p>
                      <p className="text-sm text-gray-500">1-2 business days</p>
                    </div>
                    <span>{formatPrice(3000)}</span>
                  </label>
                </div>

                <div className="mt-8 p-4 bg-background-alt">
                  <p className="text-sm text-gray-600">
                    <strong>Shipping to:</strong><br />
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}{formData.apartment && `, ${formData.apartment}`}<br />
                    {formData.city}{formData.postalCode && ` ${formData.postalCode}`}, {formData.country}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="font-display text-2xl mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: CreditCard },
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Banknote },
                    { value: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer', icon: Building }
                  ].map((method) => (
                    <label key={method.value} className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${formData.paymentMethod === method.value ? 'border-primary' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="paymentMethod" value={method.value} checked={formData.paymentMethod === method.value} onChange={handleChange} className="sr-only" />
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === method.value ? 'border-primary' : 'border-gray-300'}`}>
                        {formData.paymentMethod === method.value && <span className="w-3 h-3 rounded-full bg-primary" />}
                      </span>
                      <method.icon size={24} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{method.label}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="mt-6 pt-6 border-t space-y-4">
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleCardNumber} placeholder="Card number" className="input" maxLength={19} />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleCardExpiry} placeholder="MM/YY" className="input" maxLength={5} />
                      <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleChange} placeholder="CVV" className="input" maxLength={4} />
                    </div>
                    <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} placeholder="Name on card" className="input" />
                  </div>
                )}

                {formData.paymentMethod === 'bank' && (
                  <div className="mt-6 p-4 bg-background-alt text-sm text-gray-600">
                    <p><strong>Bank:</strong> HBL (Habib Bank Limited)</p>
                    <p><strong>Account Title:</strong> AJRAK Fashion House</p>
                    <p><strong>Account:</strong> 1234-5678-9012-3456</p>
                    <p className="mt-2 text-xs">Include order number in transfer reference.</p>
                  </div>
                )}

                <label className="flex items-start gap-3 mt-6 cursor-pointer">
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mt-1" />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="underline">Terms & Conditions</a> and <a href="#" className="underline">Privacy Policy</a>
                  </span>
                </label>
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t">
              <button onClick={prevStep} disabled={currentStep === 0} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
                <ArrowLeft size={16} /> {currentStep === 0 ? <Link to="/cart">Return to cart</Link> : 'Back'}
              </button>
              {currentStep < 2 ? (
                <button onClick={nextStep} className="btn btn-primary">
                  Continue
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-background-alt p-6 h-fit lg:sticky lg:top-32">
            <h2 className="font-display text-xl mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                  </div>
                  <p className="text-sm">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-medium border-t mt-4 pt-4">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}







