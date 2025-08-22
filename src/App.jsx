import React, { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import useStore from './store/useStore'
import UserLogin from './components/UserLogin'
import Dashboard from './components/Dashboard'
import './index.css'

function App() {
  const { currentUser, darkMode } = useStore()

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {currentUser ? <Dashboard /> : <UserLogin />}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#f3f4f6' : '#111827',
            border: darkMode ? '1px solid #4b5563' : '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  )
}

export default App