import { create } from 'zustand'

// Utility functions for localStorage management
const getStorageKey = (userId, key) => `productManager_${userId}_${key}`

const useStore = create((set, get) => ({
      // Current user state
      currentUser: null,
      users: [],
      
      // App state
      darkMode: false,
      showAdvancedFeatures: false, // Toggle for Analytics & Credits
      
      // User management
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addUser: (user) => set((state) => ({
        users: [...state.users, { ...user, id: Date.now(), createdAt: new Date().toISOString() }]
      })),
      
      updateUser: (userId, updates) => set((state) => ({
        users: state.users.map(user => 
          user.id === userId ? { ...user, ...updates } : user
        )
      })),
      
      deleteUser: (userId) => set((state) => {
        // Clear user's data from localStorage
        const userProducts = localStorage.getItem(getStorageKey(userId, 'products'))
        const userCredits = localStorage.getItem(getStorageKey(userId, 'credits'))
        if (userProducts) localStorage.removeItem(getStorageKey(userId, 'products'))
        if (userCredits) localStorage.removeItem(getStorageKey(userId, 'credits'))
        
        return {
          users: state.users.filter(user => user.id !== userId),
          currentUser: state.currentUser?.id === userId ? null : state.currentUser
        }
      }),
      
      // Theme
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Advanced features toggle
      toggleAdvancedFeatures: () => set((state) => ({ showAdvancedFeatures: !state.showAdvancedFeatures })),
      
      // User-specific data management
      getUserProducts: (userId) => {
        const products = localStorage.getItem(getStorageKey(userId, 'products'))
        return products ? JSON.parse(products) : []
      },
      
      setUserProducts: (userId, products) => {
        localStorage.setItem(getStorageKey(userId, 'products'), JSON.stringify(products))
      },
      
      getUserCredits: (userId) => {
        const credits = localStorage.getItem(getStorageKey(userId, 'credits'))
        return credits ? JSON.parse(credits) : []
      },
      
      setUserCredits: (userId, credits) => {
        localStorage.setItem(getStorageKey(userId, 'credits'), JSON.stringify(credits))
      },
      
      // Product management
      addProduct: (product) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        const products = get().getUserProducts(currentUser.id)
        const newProduct = {
          ...product,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const updatedProducts = [...products, newProduct]
        get().setUserProducts(currentUser.id, updatedProducts)
        return true
      },
      
      updateProduct: (productId, updates) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        const products = get().getUserProducts(currentUser.id)
        const updatedProducts = products.map(product =>
          product.id === productId
            ? { ...product, ...updates, updatedAt: new Date().toISOString() }
            : product
        )
        
        get().setUserProducts(currentUser.id, updatedProducts)
        return true
      },
      
      deleteProduct: (productId) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        const products = get().getUserProducts(currentUser.id)
        const updatedProducts = products.filter(product => product.id !== productId)
        
        get().setUserProducts(currentUser.id, updatedProducts)
        return true
      },
      
      // Credit management
      addCredit: (credit) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        const credits = get().getUserCredits(currentUser.id)
        const newCredit = {
          ...credit,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const updatedCredits = [...credits, newCredit]
        get().setUserCredits(currentUser.id, updatedCredits)
        
        // Update product status if it's a credit sale
        if (credit.productId) {
          get().updateProduct(credit.productId, {
            status: credit.amountRemaining > 0 ? 'Reserved' : 'Sold',
            saleDate: credit.amountRemaining === 0 ? new Date().toISOString() : null
          })
        }
        
        return true
      },
      
      updateCredit: (creditId, updates) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        const credits = get().getUserCredits(currentUser.id)
        const updatedCredits = credits.map(credit =>
          credit.id === creditId
            ? { ...credit, ...updates, updatedAt: new Date().toISOString() }
            : credit
        )
        
        get().setUserCredits(currentUser.id, updatedCredits)
        return true
      },
      
      addPayment: (creditId, paymentAmount) => {
        const { currentUser } = get()
        if (!currentUser) return false
        
        const credits = get().getUserCredits(currentUser.id)
        const credit = credits.find(c => c.id === creditId)
        if (!credit) return false
        
        const newAmountPaid = credit.amountPaid + paymentAmount
        const newAmountRemaining = Math.max(0, credit.amountRemaining - paymentAmount)
        
        get().updateCredit(creditId, {
          amountPaid: newAmountPaid,
          amountRemaining: newAmountRemaining
        })
        
        // Update product status if fully paid
        if (newAmountRemaining === 0 && credit.productId) {
          get().updateProduct(credit.productId, {
            status: 'Sold',
            saleDate: new Date().toISOString()
          })
        }
        
        return true
      },
      
      // Analytics and reporting
      getAnalytics: (userId) => {
        const products = get().getUserProducts(userId || get().currentUser?.id)
        const credits = get().getUserCredits(userId || get().currentUser?.id)
        
        const totalProducts = products.length
        const inStock = products.filter(p => p.status === 'In Stock').length
        const sold = products.filter(p => p.status === 'Sold').length
        const reserved = products.filter(p => p.status === 'Reserved').length
        
        const totalRevenue = products
          .filter(p => p.status === 'Sold')
          .reduce((sum, p) => sum + (p.salePrice || 0), 0)
        
        const totalCost = products
          .filter(p => p.status === 'Sold')
          .reduce((sum, p) => sum + (p.costPriceUsd || 0) + (p.transportPrice || 0), 0)
        
        const totalProfit = totalRevenue - totalCost
        
        const totalCredits = credits.reduce((sum, c) => sum + c.totalAmount, 0)
        const totalPaid = credits.reduce((sum, c) => sum + c.amountPaid, 0)
        const totalOutstanding = credits.reduce((sum, c) => sum + c.amountRemaining, 0)
        
        const lowStockProducts = [] // Removed low stock functionality
        
        return {
          products: { totalProducts, inStock, sold, reserved },
          financial: { totalRevenue, totalCost, totalProfit },
          credits: { totalCredits, totalPaid, totalOutstanding },
          lowStock: lowStockProducts,
          profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
        }
      },
      
      // Export functionality
      exportUserData: (userId) => {
        const user = get().users.find(u => u.id === userId)
        const products = get().getUserProducts(userId)
        const credits = get().getUserCredits(userId)
        const analytics = get().getAnalytics(userId)
        
        return {
          user,
          products,
          credits,
          analytics,
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        }
      }
    }))

// Load initial data from localStorage
if (typeof window !== 'undefined') {
  const savedData = localStorage.getItem('product-manager-storage')
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      useStore.setState(parsed)
    } catch (e) {
      console.error('Failed to load saved data:', e)
    }
  }

  // Save to localStorage on state changes
  useStore.subscribe((state) => {
    const dataToSave = {
      users: state.users,
      currentUser: state.currentUser,
      darkMode: state.darkMode,
      showAdvancedFeatures: state.showAdvancedFeatures
    }
    localStorage.setItem('product-manager-storage', JSON.stringify(dataToSave))
  })
}

export default useStore