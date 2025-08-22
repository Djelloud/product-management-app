import React, { useState } from 'react'
import { Users, Plus, LogIn, Moon, Sun } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'

const UserLogin = () => {
  const { users, addUser, setCurrentUser, darkMode, toggleDarkMode } = useStore()
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    fullName: ''
  })

  const handleCreateUser = (e) => {
    e.preventDefault()
    
    if (!formData.username.trim()) {
      toast.error('Username is required!')
      return
    }
    
    if (users.some(user => user.username.toLowerCase() === formData.username.toLowerCase())) {
      toast.error('Username already exists!')
      return
    }
    
    addUser({
      ...formData,
      username: formData.username.toLowerCase(),
      lastLogin: new Date().toISOString()
    })
    
    toast.success('User created successfully!')
    setShowCreateUser(false)
    setFormData({
      username: '',
      fullName: ''
    })
  }

  const handleLogin = (user) => {
    setCurrentUser({
      ...user,
      lastLogin: new Date().toISOString()
    })
    toast.success(`Welcome back, ${user.fullName || user.username}!`)
  }

  const createSampleUsers = () => {
    const sampleUsers = [
      {
        username: 'amine_algiers',
        fullName: 'Amine Djelloud',
        location: 'Algiers',
        businessName: 'Tech Import Algiers'
      },
      {
        username: 'mohamed_oran',
        fullName: 'Mohamed Benali',
        location: 'Oran',
        businessName: 'Electronics Store Oran'
      },
      {
        username: 'fatima_constantine',
        fullName: 'Fatima Khelifi',
        location: 'Constantine',
        businessName: 'Computer Shop Constantine'
      }
    ]

    sampleUsers.forEach(user => {
      if (!users.some(u => u.username === user.username)) {
        addUser({
          ...user,
          lastLogin: new Date().toISOString()
        })
      }
    })

    toast.success('Sample users created!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Product Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Multi-User Edition - Select or create a user to continue
          </p>
          
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="mt-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User List */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select User
              </h2>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No users found. Create your first user or add sample data.
                  </p>
                  <button
                    onClick={createSampleUsers}
                    className="btn-outline"
                  >
                    Add Sample Users
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-600 cursor-pointer transition-colors group"
                      onClick={() => handleLogin(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400">
                            {user.fullName || user.username}
                          </h3>
                          {user.fullName && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </p>
                          )}
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                        <LogIn className="w-5 h-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create User Form */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New User
              </h2>
            </div>
            <div className="card-body">
              {!showCreateUser ? (
                <div className="text-center py-12">
                  <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create a new user account to get started
                  </p>
                  <button
                    onClick={() => setShowCreateUser(true)}
                    className="btn-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="e.g., amine_algiers"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g., Amine Djelloud"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>



                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                      Create User
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateUser(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserLogin