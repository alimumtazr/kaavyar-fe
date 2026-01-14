import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/useStore'
import { authAPI } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore(state => state.login)
  
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tokenData = await authAPI.login(formData.email, formData.password)
      localStorage.setItem('token', tokenData.access_token)
      
      const user = await authAPI.getMe()
      login(user, tokenData.access_token)
      
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-[110px] min-h-screen flex items-center justify-center bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4 py-16"
      >
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-3xl tracking-[0.2em] text-primary">
            AJRAK
          </Link>
          <h1 className="mt-6 font-display text-3xl">Welcome Back</h1>
          <p className="mt-2 text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className="input"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}





