import React from 'react'
import { BarChart3, TrendingUp } from 'lucide-react'

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics & Reports
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Business insights and performance metrics
        </p>
      </div>

      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Analytics Dashboard Coming Soon
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Detailed analytics and reporting features will be available shortly
        </p>
      </div>
    </div>
  )
}

export default Analytics