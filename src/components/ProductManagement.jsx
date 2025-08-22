import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Upload,
  DollarSign,
  Package,
  Calendar,
  MapPin
} from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'

const ProductManagement = () => {
  const { 
    currentUser, 
    getUserProducts, 
    addProduct, 
    updateProduct, 
    deleteProduct 
  } = useStore()
  
  const products = getUserProducts(currentUser?.id)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'ordinateur-portable',
    costPriceCad: '',
    costPriceDzd: '',
    transportPrice: '',
    salePrice: '',
    packageSize: '',
    picturePath: '',
    imageUrl: '',
    arrivalDate: new Date().toISOString().split('T')[0],
    saleDate: '',
    status: 'In Stock',
    quantity: 1,
    notes: ''
  })

  const categories = [
    'ordinateur-portable',
    'smartphone', 
    'tablet',
    'accessoires',
    'other'
  ]

  const statuses = [
    'In Stock',
    'Sold',
    'Reserved',
    'Damaged'
  ]

  // Remove auto-calculation - DZD is now manual input

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Product name is required!')
      return
    }

    const productData = {
      ...formData,
      costPriceCad: parseFloat(formData.costPriceCad) || 0,
      costPriceDzd: parseFloat(formData.costPriceDzd) || 0,
      transportPrice: parseFloat(formData.transportPrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      quantity: parseInt(formData.quantity) || 1
    }

    if (editingProduct) {
      if (updateProduct(editingProduct.id, productData)) {
        toast.success('Product updated successfully!')
        setEditingProduct(null)
      } else {
        toast.error('Failed to update product')
      }
    } else {
      if (addProduct(productData)) {
        toast.success('Product added successfully!')
      } else {
        toast.error('Failed to add product')
      }
    }

    setFormData({
      name: '',
      category: 'ordinateur-portable',
      costPriceCad: '',
      costPriceDzd: '',
      transportPrice: '',
      salePrice: '',
      packageSize: '',
      arrivalDate: new Date().toISOString().split('T')[0],
      saleDate: '',
      status: 'In Stock',
      quantity: 1,
      notes: ''
    })
    setShowForm(false)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
            setFormData({
          name: product.name || '',
          category: product.category || 'ordinateur-portable',
          costPriceCad: product.costPriceCad?.toString() || '',
          costPriceDzd: product.costPriceDzd?.toString() || '',
          transportPrice: product.transportPrice?.toString() || '',
          salePrice: product.salePrice?.toString() || '',
          packageSize: product.packageSize || '',
          picturePath: product.picturePath || '',
          imageUrl: product.imageUrl || '',
          arrivalDate: product.arrivalDate || new Date().toISOString().split('T')[0],
          saleDate: product.saleDate || '',
          status: product.status || 'In Stock',
          quantity: product.quantity || 1,
          notes: product.notes || ''
        })
    setShowForm(true)
  }

  const handleDelete = (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      if (deleteProduct(product.id)) {
        toast.success('Product deleted successfully!')
        // Refresh products list
        window.location.reload()
      } else {
        toast.error('Failed to delete product')
      }
    }
  }

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

  const calculateProfit = (product) => {
    if (!product.salePrice || !product.costPriceCad) return null
    const totalCost = product.costPriceCad + (product.transportPrice || 0)
    return product.salePrice - totalCost
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product inventory and pricing
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setFormData({
              name: '',
              category: 'ordinateur-portable',
              costPriceCad: '',
              costPriceDzd: '',
              transportPrice: '',
              salePrice: '',
              packageSize: '',
              picturePath: '',
              imageUrl: '',
              arrivalDate: new Date().toISOString().split('T')[0],
              saleDate: '',
              status: 'In Stock',
              quantity: 1,
              notes: ''
            })
            setShowForm(true)
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="input pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Filter className="w-4 h-4" />
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
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
                    Transport Price (CAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={formData.transportPrice}
                    onChange={(e) => setFormData({...formData, transportPrice: e.target.value})}
                    placeholder="50.00"
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
                    Package Size
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.packageSize}
                    onChange={(e) => setFormData({...formData, packageSize: e.target.value})}
                    placeholder="35cm x 25cm x 3cm"
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.arrivalDate}
                    onChange={(e) => setFormData({...formData, arrivalDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Sale Date
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.saleDate}
                    onChange={(e) => setFormData({...formData, saleDate: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    className="input"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                

              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  className="input h-20 resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this product..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const profit = calculateProfit(product)
          
          return (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-body">
                {/* Product Image */}
                {(product.imageUrl || product.picturePath) && (
                  <div className="mb-4">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {product.picturePath}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {product.category}
                    </p>
                  </div>
                  <span className={`badge ${getStatusBadge(product.status)}`}>
                    {product.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Cost:</span>
                    <span className="font-medium">${product.costPriceCad}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Sale Price:</span>
                    <span className="font-medium">${product.salePrice}</span>
                  </div>
                  {profit && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Profit:</span>
                      <span className={`font-medium ${profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${profit.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
                    <span className="font-medium">{product.quantity || 1}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn-outline flex-1 text-xs"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product)}
                    className="btn-danger text-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || filterStatus !== 'all' || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first product'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && filterCategory === 'all' && (
            <button
              onClick={() => {
                setEditingProduct(null)
                setFormData({
                  name: '',
                  category: 'ordinateur-portable',
                  costPriceCad: '',
                  costPriceDzd: '',
                  transportPrice: '',
                  salePrice: '',
                  packageSize: '',
                  picturePath: '',
                  imageUrl: '',
                  arrivalDate: new Date().toISOString().split('T')[0],
                  saleDate: '',
                  status: 'In Stock',
                  quantity: 1,
                  notes: ''
                })
                setShowForm(true)
              }}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductManagement