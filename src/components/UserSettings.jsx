import React, { useState } from 'react'
import { Settings, User, Moon, Sun, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'

const UserSettings = () => {
  const { currentUser, updateUser, darkMode, toggleDarkMode, showAdvancedFeatures, toggleAdvancedFeatures } = useStore()
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || ''
  })

  const handleSave = () => {
    if (updateUser(currentUser.id, formData)) {
      toast.success('Settings updated successfully!')
    } else {
      toast.error('Failed to update settings')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account and app settings
        </p>
      </div>

      <div className="max-w-2xl">
        {/* User Profile */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Profile
              </h3>
            </div>
          </div>
          <div className="card-body space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                className="input bg-gray-50 dark:bg-gray-700"
                value={currentUser?.username || ''}
                readOnly
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Username cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="input"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                placeholder="Your full name"
              />
            </div>

            <button
              onClick={handleSave}
              className="btn-primary w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>


      </div>

      {/* App Settings */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              App Settings
            </h3>
          </div>
        </div>
        <div className="card-body space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Dark Mode
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${darkMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Advanced Features
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show Analytics and Credits tabs (you can enable these later)
              </p>
            </div>
            <button
              onClick={toggleAdvancedFeatures}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${showAdvancedFeatures ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${showAdvancedFeatures ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSettings