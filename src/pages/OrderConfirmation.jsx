import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()

  return (
    <div className="pt-[110px] min-h-screen flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg mx-auto px-4 py-16"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={40} className="text-primary" />
        </motion.div>

        <h1 className="font-display text-4xl text-primary">Thank You!</h1>
        <p className="mt-4 text-gray-600">
          We've received your order and will begin processing it soon.
        </p>

        <div className="mt-8 p-6 bg-background-alt">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-xl font-medium text-primary mt-1">{orderNumber}</p>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          A confirmation email has been sent to your email address.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/account" className="btn btn-secondary">
            View Orders
          </Link>
        </div>
      </motion.div>
    </div>
  )
}







