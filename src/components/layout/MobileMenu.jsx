import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, ChevronDown, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore, useAuthStore } from '../../store/useStore'

const menuItems = [
  { name: 'New Arrivals', href: '/products?badges=new' },
  { 
    name: 'Ready to Wear', 
    href: '/products?subcategory=ready-to-wear',
    children: [
      { name: 'Kurtas & Tunics', href: '/products?category=kurtas' },
      { name: 'Kaftans', href: '/products?category=kaftans' },
      { name: 'Tops', href: '/products?category=tops' },
      { name: 'Anarkalis', href: '/products?category=anarkalis' },
    ]
  },
  { 
    name: 'Couture', 
    href: '/products?subcategory=couture',
    children: [
      { name: 'Lehengas', href: '/products?category=lehengas' },
      { name: 'Bridal', href: '/products?category=bridal-lehengas' },
      { name: 'Gowns', href: '/products?category=gowns' },
    ]
  },
  { name: 'Menswear', href: '/products?subcategory=menswear' },
  { name: 'Accessories', href: '/products?subcategory=accessories' },
]

export default function MobileMenu() {
  const { mobileMenuOpen, closeMobileMenu } = useUIStore()
  const { user } = useAuthStore()
  const [openSubmenu, setOpenSubmenu] = useState(null)

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 w-full max-w-sm h-full bg-white z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <span className="font-display text-xl tracking-[0.2em] text-primary">AJRAK</span>
              <button onClick={closeMobileMenu} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {menuItems.map((item) => (
                <div key={item.name} className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <Link
                      to={item.href}
                      onClick={closeMobileMenu}
                      className="flex-1 px-6 py-4 text-sm font-normal tracking-wide uppercase"
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <button
                        onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
                        className="px-6 py-4"
                      >
                        <ChevronDown 
                          size={18} 
                          className={`transition-transform ${openSubmenu === item.name ? 'rotate-180' : ''}`}
                        />
                      </button>
                    )}
                  </div>
                  
                  {/* Submenu */}
                  <AnimatePresence>
                    {item.children && openSubmenu === item.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={closeMobileMenu}
                            className="block px-10 py-3 text-sm text-gray-600"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Footer Links */}
            <div className="px-6 py-6 border-t space-y-3">
              {user?.is_admin && (
                <Link 
                  to="/admin" 
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 text-sm text-amber-600 font-medium"
                >
                  <Shield size={16} />
                  Admin Panel
                </Link>
              )}
              <Link 
                to="/account" 
                onClick={closeMobileMenu}
                className="block text-sm text-gray-600"
              >
                Account
              </Link>
              <Link 
                to="/account?tab=wishlist" 
                onClick={closeMobileMenu}
                className="block text-sm text-gray-600"
              >
                Wishlist
              </Link>
              <a href="#" className="block text-sm text-gray-600">
                Contact Us
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}



