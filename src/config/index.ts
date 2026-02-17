/**
 * Configuration module for WealthHub
 * Loads environment variables and provides configuration objects
 */

export const config = {
  gasUrl: import.meta.env.VITE_GAS_URL || '',
}

// Validate that required environment variables are set
if (!config.gasUrl) {
  console.warn('⚠️ VITE_GAS_URL not configured in .env file. Cloud sync will be unavailable.')
}
