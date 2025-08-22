import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  DollarSign,
  User,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'

const CreditManagement = () => {
  const { 
    currentUser, 
    getUserProducts, 
    getUserCredits, 
    addCredit, 
    updateCredit,
    addPayment
  } = useStore()
  
  const products = getUserProducts(currentUser?.id)
  const credits = getUserCredits(currentUser?.id)
  const [showForm, setShowForm] = useState(false)
  const [editingCredit, setEditingCredit] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedCredit, setSelectedCredit] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState('')
  
  const [formData, setFormData] = useState({
    productId: '',
    customerName: '',
    totalAmount: '',
    amountPaid: '',
    notes: ''
  })

  // Data is now reactive from the store

  // Auto-calculate remaining amount
  const amountRemaining = formData.totalAmount && formData.amountPaid ? 
    (parseFloat(formData.totalAmount) - parseFloat(formData.amountPaid)).toFixed(2) : '0.00'

  // Filter available products (In Stock only)
  const availableProducts = products.filter(product => product.status === 'In Stock')

  // Filter credits based on search
  const filteredCredits = credits.filter(credit => {
    const product = products.find(p => p.id === credit.productId)
    const searchLower = searchTerm.toLowerCase()
    
    return credit.customerName.toLowerCase().includes(searchLower) ||
           (product?.name.toLowerCase().includes(searchLower))
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.productId || !formData.customerName.trim() || !formData.totalAmount) {
      toast.error('Please fill all required fields!')
      return
    }

    const creditData = {
      productId: parseInt(formData.productId),
      customerName: formData.customerName.trim(),
      totalAmount: parseFloat(formData.totalAmount) || 0,
      amountPaid: parseFloat(formData.amountPaid) || 0,
      amountRemaining: parseFloat(amountRemaining) || 0,
      notes: formData.notes.trim()
    }

    if (editingCredit) {
      if (updateCredit(editingCredit.id, creditData)) {
        toast.success('Credit updated successfully!')
        setEditingCredit(null)
      } else {
        toast.error('Failed to update credit')
      }
    } else {
      if (addCredit(creditData)) {
        toast.success('Credit sale created successfully!')
      } else {
        toast.error('Failed to create credit sale')
      }
    }

    setFormData({
      productId: '',
      customerName: '',
      totalAmount: '',
      amountPaid: '',
      notes: ''
    })
    setShowForm(false)
    
    // Data will automatically refresh from reactive store
  }

  const handleAddPayment = () => {
    if (!paymentAmount || !selectedCredit) {
      toast.error('Please enter a payment amount!')
      return
    }

    const amount = parseFloat(paymentAmount)
    if (amount <= 0 || amount > selectedCredit.amountRemaining) {
      toast.error('Invalid payment amount!')
      return
    }

    if (addPayment(selectedCredit.id, amount)) {
      toast.success('Payment added successfully!')
      setShowPaymentModal(false)
      setSelectedCredit(null)
      setPaymentAmount('')
      
      // Data will automatically refresh from reactive store
    } else {
      toast.error('Failed to add payment')
    }
  }

  const handleEdit = (credit) => {
    setEditingCredit(credit)
    setFormData({
      productId: credit.productId.toString(),
      customerName: credit.customerName,
      totalAmount: credit.totalAmount.toString(),
      amountPaid: credit.amountPaid.toString(),
      notes: credit.notes || ''
    })
    setShowForm(true)
  }

  const getPaymentProgress = (credit) => {
    return (credit.amountPaid / credit.totalAmount) * 100
  }

  const getStatusBadge = (credit) => {
    if (credit.amountRemaining === 0) return 'badge-success'
    if (credit.amountPaid === 0) return 'badge-danger'
    return 'badge-warning'
  }

  const getStatusText = (credit) => {
    if (credit.amountRemaining === 0) return 'Paid'
    if (credit.amountPaid === 0) return 'Unpaid'
    return 'Partial'
  }

  // Calculate summary stats
  const totalCredits = credits.reduce((sum, c) => sum + c.totalAmount, 0)
  const totalPaid = credits.reduce((sum, c) => sum + c.amountPaid, 0)
  const totalOutstanding = credits.reduce((sum, c) => sum + c.amountRemaining, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Credit Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage customer credit sales and payments
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCredit(null)
            setFormData({
              productId: '',
              customerName: '',
              totalAmount: '',
              amountPaid: '',
              notes: ''
            })
            setShowForm(true)
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Credit Sale
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Credits
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalCredits.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Paid
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Outstanding
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${totalOutstanding.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-500 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-body">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search credits by customer name or product..."
              className="input pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Credit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingCredit ? 'Edit Credit Sale' : 'New Credit Sale'}
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
                  Amount Paid
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

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount Remaining
                </label>
                <input
                  type="text"
                  className="input bg-gray-50 dark:bg-gray-700"
                  value={`$${amountRemaining}`}
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  className="input h-20 resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes about this credit sale..."
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingCredit ? 'Update Credit' : 'Create Credit Sale'}
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

      {/* Payment Modal */}
      {showPaymentModal && selectedCredit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Add Payment
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCredit.customerName} - Remaining: ${selectedCredit.amountRemaining.toFixed(2)}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={selectedCredit.amountRemaining}
                  className="input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleAddPayment}
                  className="btn-primary flex-1"
                >
                  Add Payment
                </button>
                <button
                  onClick={() => {
                    setShowPaymentModal(false)
                    setSelectedCredit(null)
                    setPaymentAmount('')
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credits List */}
      <div className="space-y-4">
        {filteredCredits.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No credits found' : 'No credit sales yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first credit sale to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  setEditingCredit(null)
                  setFormData({
                    productId: '',
                    customerName: '',
                    totalAmount: '',
                    amountPaid: '',
                    notes: ''
                  })
                  setShowForm(true)
                }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Credit Sale
              </button>
            )}
          </div>
        ) : (
          filteredCredits.map((credit) => {
            const product = products.find(p => p.id === credit.productId)
            const progress = getPaymentProgress(credit)
            
            return (
              <div key={credit.id} className="card">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {credit.customerName}
                        </h3>
                        <span className={`badge ${getStatusBadge(credit)}`}>
                          {getStatusText(credit)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Product: {product?.name || 'Unknown Product'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {new Date(credit.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${credit.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remaining: ${credit.amountRemaining.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Payment Progress</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Paid: ${credit.amountPaid.toFixed(2)}</span>
                      <span>Total: ${credit.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {credit.amountRemaining > 0 && (
                      <button
                        onClick={() => {
                          setSelectedCredit(credit)
                          setShowPaymentModal(true)
                        }}
                        className="btn-primary text-xs"
                      >
                        <DollarSign className="w-3 h-3 mr-1" />
                        Add Payment
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(credit)}
                      className="btn-outline text-xs"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default CreditManagement