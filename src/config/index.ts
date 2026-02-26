/**
 * Configuration module for WealthHub
 * Loads environment variables and provides configuration objects
 */

export const config = {
  // Google Apps Script URL for data persistence
  gasUrl: import.meta.env.VITE_GAS_URL || '',
  
  // Backend API URL
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
}

// Validate that required environment variables are set
if (!config.gasUrl) {
  console.warn('⚠️ VITE_GAS_URL not configured. Cloud sync will be unavailable.')
}

console.log('🔧 Config loaded:', {
  gasUrl: config.gasUrl ? '✅ Configured' : '❌ Not configured',
  backendUrl: config.backendUrl
})
