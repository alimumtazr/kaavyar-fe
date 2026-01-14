import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
        localStorage.setItem('token', token)
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('token')
      },
      
      updateUser: (user) => set({ user })
    }),
    {
      name: 'auth-storage'
    }
  )
)

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, size, quantity = 1) => {
        const { items } = get()
        const existingIndex = items.findIndex(
          item => item.productId === product.id && item.size === size
        )
        
        if (existingIndex >= 0) {
          const newItems = [...items]
          newItems[existingIndex].quantity += quantity
          set({ items: newItems })
        } else {
          set({ items: [...items, { 
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0],
            size,
            quantity 
          }] })
        }
      },
      
      removeItem: (productId, size) => {
        const { items } = get()
        set({ items: items.filter(item => !(item.productId === productId && item.size === size)) })
      },
      
      updateQuantity: (productId, size, quantity) => {
        const { items } = get()
        const newItems = items.map(item => 
          item.productId === productId && item.size === size
            ? { ...item, quantity }
            : item
        )
        set({ items: newItems })
      },
      
      clearCart: () => set({ items: [] }),
      
      getCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      getTotal: () => get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: (state, version) => {
        // Normalize legacy items that stored full product object
        if (version < 2 && state?.items) {
          return {
            ...state,
            items: state.items.map((item) => {
              // If already normalized
              if (item.productId && item.price !== undefined) return item
              const product = item.product || {}
              return {
                productId: product.id || item.productId || '',
                name: product.name || item.name || '',
                price: product.price || item.price || 0,
                image: product.images?.[0] || item.image || '',
                size: item.size || product.sizes?.[0] || 'M',
                quantity: item.quantity || 1,
              }
            })
          }
        }
        return state
      }
    }
  )
)

// Wishlist Store
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      add: (productId) => {
        const { items } = get()
        if (!items.includes(productId)) {
          set({ items: [...items, productId] })
        }
      },
      
      remove: (productId) => {
        const { items } = get()
        set({ items: items.filter(id => id !== productId) })
      },
      
      toggle: (productId) => {
        const { items } = get()
        if (items.includes(productId)) {
          set({ items: items.filter(id => id !== productId) })
          return false
        } else {
          set({ items: [...items, productId] })
          return true
        }
      },
      
      has: (productId) => get().items.includes(productId),
      
      count: () => get().items.length,
      
      clear: () => set({ items: [] })
    }),
    {
      name: 'wishlist-storage'
    }
  )
)

// UI Store
export const useUIStore = create((set) => ({
  mobileMenuOpen: false,
  searchOpen: false,
  
  openMobileMenu: () => set({ mobileMenuOpen: true }),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen }))
}))
