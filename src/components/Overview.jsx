import React, { useState } from 'react'
import { 
  Package, 
  ShoppingCart, 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Eye,
  Plus
} from 'lucide-react'
import useStore from '../store/useStore'

const Overview = () => {
  const { currentUser, getUserProducts, getUserCredits, getAnalytics, addProduct, showAdvancedFeatures, toggleAdvancedFeatures } = useStore()
  const [showQuickAddProduct, setShowQuickAddProduct] = useState(false)
  const [showQuickCredit, setShowQuickCredit] = useState(false)
  
  const products = getUserProducts(currentUser?.id)
  const credits = getUserCredits(currentUser?.id)
  const analytics = getAnalytics(currentUser?.id)

  const stats = [
    {
      title: 'Total Products',
      value: analytics.products.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12% from last month'
    },
    {
      title: 'In Stock',
      value: analytics.products.inStock,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: `${analytics.products.inStock} available`
    },
    {
      title: 'Total Revenue',
      value: `$${analytics.financial.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      change: `${analytics.profitMargin.toFixed(1)}% profit margin`
    },
    {
      title: 'Outstanding Credits',
      value: `$${analytics.credits.totalOutstanding.toFixed(2)}`,
      icon: CreditCard,
      color: 'bg-red-500',
      change: `${credits.length} credit sales`
    }
  ]

  const recentProducts = products
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const recentCredits = credits
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return 'badge-success'
      case 'Sold':
        return 'badge-primary'
      case 'Reserved':
        return 'badge-warning'
      case 'Damaged':
        return 'badge-danger'
      default:
        return 'badge-primary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {currentUser?.fullName || currentUser?.username}!
        </h1>
        <p className="text-primary-100">
          {currentUser?.businessName && `${currentUser.businessName} • `}
          {currentUser?.location}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span>•</span>
          <span>Last Login: {new Date(currentUser?.lastLogin).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {stat.change}
                </p>
              </div>
            </div>
          )
        })}
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Products
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="card-body">
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No products yet
                </p>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.category} • ${product.salePrice}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`badge ${getStatusBadge(product.status)}`}>
                        {product.status}
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Credits */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Credits
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="card-body">
            {recentCredits.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No credit sales yet
                </p>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Credit Sale
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentCredits.map((credit) => {
                  const product = products.find(p => p.id === credit.productId)
                  const progress = (credit.amountPaid / credit.totalAmount) * 100
                  
                  return (
                    <div 
                      key={credit.id}
                      className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {credit.customerName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product?.name || 'Unknown Product'}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${credit.amountRemaining.toFixed(2)} remaining
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ${credit.amountPaid.toFixed(2)} of ${credit.totalAmount.toFixed(2)} paid
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowQuickAddProduct(true)}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            >
              <Package className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Add New Product
              </p>
            </button>
            
            <button 
              onClick={() => {
                if (!showAdvancedFeatures) {
                  toggleAdvancedFeatures()
                }
                setShowQuickCredit(true)
              }}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            >
              <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                Create Credit Sale
              </p>
            </button>
            
            <button 
              onClick={() => {
                if (!showAdvancedFeatures) {
                  toggleAdvancedFeatures()
                }
                // Navigate to analytics would go here - for now just enable advanced features
              }}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 transition-colors group"
            >
              <TrendingUp className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                {showAdvancedFeatures ? 'View Analytics' : 'Enable Analytics'}
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Product Modal */}
      {showQuickAddProduct && <QuickAddProductModal onClose={() => setShowQuickAddProduct(false)} />}

      {/* Quick Credit Modal */}
      {showQuickCredit && <QuickCreditModal onClose={() => setShowQuickCredit(false)} />}
    </div>
  )
}

// Quick Add Product Modal Component
const QuickAddProductModal = ({ onClose }) => {
  const { currentUser, addProduct } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    category: 'ordinateur-portable',
    costPriceCad: '',
    costPriceDzd: '',
    salePrice: '',
    picturePath: '',
    imageUrl: '',
    status: 'In Stock'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Product name is required!')
      return
    }

    const productData = {
      ...formData,
      costPriceCad: parseFloat(formData.costPriceCad) || 0,
      costPriceDzd: parseFloat(formData.costPriceDzd) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      arrivalDate: new Date().toISOString().split('T')[0],
      quantity: 1
    }

    if (addProduct(productData)) {
      alert('Product added successfully!')
      onClose()
      // Refresh page to show new product
      setTimeout(() => window.location.reload(), 500)
    } else {
      alert('Failed to add product')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Add Product
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., MacBook Pro 14"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              className="input"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="ordinateur-portable">Ordinateur-portable</option>
              <option value="smartphone">Smartphone</option>
              <option value="tablet">Tablet</option>
              <option value="accessoires">Accessoires</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cost Price (CAD)
            </label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.costPriceCad}
              onChange={(e) => setFormData({...formData, costPriceCad: e.target.value})}
              placeholder="800.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cost Price (DZD)
            </label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.costPriceDzd}
              onChange={(e) => setFormData({...formData, costPriceDzd: e.target.value})}
              placeholder="107600.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sale Price (CAD)
            </label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.salePrice}
              onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
              placeholder="1200.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product Picture
            </label>
            <input
              type="file"
              accept="image/*"
              className="input"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  // Convert to base64 for persistent storage
                  const reader = new FileReader()
                  reader.onload = (event) => {
                    const base64 = event.target.result
                    setFormData({...formData, picturePath: file.name, imageUrl: base64})
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
            {formData.imageUrl && (
              <div className="mt-2">
                <img 
                  src={formData.imageUrl} 
                  alt="Product preview" 
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.picturePath}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Add Product
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Quick Credit Modal Component  
const QuickCreditModal = ({ onClose }) => {
  const { currentUser, getUserProducts, addCredit } = useStore()
  const products = getUserProducts(currentUser?.id)
  const [formData, setFormData] = useState({
    productId: '',
    customerName: '',
    totalAmount: '',
    amountPaid: ''
  })

  const availableProducts = products.filter(product => product.status === 'In Stock')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.productId || !formData.customerName.trim() || !formData.totalAmount) {
      alert('Please fill all required fields!')
      return
    }

    const creditData = {
      productId: parseInt(formData.productId),
      customerName: formData.customerName.trim(),
      totalAmount: parseFloat(formData.totalAmount) || 0,
      amountPaid: parseFloat(formData.amountPaid) || 0,
      amountRemaining: (parseFloat(formData.totalAmount) || 0) - (parseFloat(formData.amountPaid) || 0)
    }

    if (addCredit(creditData)) {
      alert('Credit sale created successfully!')
      onClose()
      // Refresh page to show updates
      setTimeout(() => window.location.reload(), 500)
    } else {
      alert('Failed to create credit sale')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Credit Sale
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Product *
            </label>
            <select
              required
              className="input"
              value={formData.productId}
              onChange={(e) => {
                const productId = e.target.value
                const product = products.find(p => p.id === parseInt(productId))
                setFormData({
                  ...formData, 
                  productId,
                  totalAmount: product?.salePrice?.toString() || ''
                })
              }}
            >
              <option value="">Select a product</option>
              {availableProducts.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.salePrice}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              placeholder="Customer full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Total Amount *
            </label>
            <input
              type="number"
              step="0.01"
              required
              className="input"
              value={formData.totalAmount}
              onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
              placeholder="Total sale amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Payment
            </label>
            <input
              type="number"
              step="0.01"
              className="input"
              value={formData.amountPaid}
              onChange={(e) => setFormData({...formData, amountPaid: e.target.value})}
              placeholder="Initial payment amount"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Create Credit Sale
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Overview