/**
 * Debug logger utility for classification API calls
 */

/**
 * Log classification API call (request and response together)
 * @param {string} endpoint - API endpoint being called
 * @param {object} params - Request parameters
 * @param {object} response - API response data
 */
export const logClassification = (endpoint, params, response) => {
  console.log(`🔍 [Classification API] Endpoint: ${endpoint}`);
  console.log('🔍 [Classification API] Params:', params);
  console.log('✅ [Classification API] Response:', response);
};
