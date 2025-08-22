import React, { useState } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'
import useStore from '../store/useStore'
import Overview from './Overview'
import ProductManagement from './ProductManagement'
import CreditManagement from './CreditManagement'
import Analytics from './Analytics'
import UserSettings from './UserSettings'

const Dashboard = () => {
  const { currentUser, setCurrentUser, showAdvancedFeatures } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    setCurrentUser(null)
    setSidebarOpen(false)
  }

  const baseNavigation = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: Package },
    { id: 'settings', name: 'Settings', icon: Settings },
  ]

  const advancedNavigation = [
    { id: 'credits', name: 'Credits', icon: CreditCard },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  ]

  const navigation = showAdvancedFeatures 
    ? [...baseNavigation.slice(0, 2), ...advancedNavigation, baseNavigation[2]]
    : baseNavigation

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />
      case 'products':
        return <ProductManagement />
      case 'credits':
        return <CreditManagement />
      case 'analytics':
        return <Analytics />
      case 'settings':
        return <UserSettings />
      default:
        return <Overview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  Product Manager
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser?.businessName || 'Business Dashboard'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-medium">
                  {(currentUser?.fullName || currentUser?.username || 'U')[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {currentUser?.fullName || currentUser?.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {currentUser?.location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {activeTab}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser?.fullName || currentUser?.username}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default Dashboard