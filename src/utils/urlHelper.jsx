// This is a utility helper for maintaining subdomain URLs
// Save this file in a new location such as src/utils/urlHelper.js

/**
 * Returns the current subdomain if any
 * @returns {string|null} The subdomain or null if on root domain
 */
export const getSubdomain = () => {
    const host = window.location.host;
    const parts = host.split('.');
    
    // For localhost development
    if (host.includes('localhost')) {
      if (parts.length > 1 && parts[0] !== 'localhost') {
        return parts[0];
      }
      return null;
    }
  
    // For production domains
    if (parts.length > 2) {
      return parts[0];
    }
    return null;
  };
  
  /**
   * Creates a URL with the current tenant subdomain
   * @param {string} path - The path to navigate to
   * @returns {string} - Full URL with subdomain
   */
  export const getSubdomainUrl = (path) => {
    const subdomain = localStorage.getItem('tenant_domain');
    
    if (!subdomain) {
      return `http://localhost:3000${path}`;
    }
  
    return `http://${subdomain}.localhost:3000${path}`;
  };
  
  /**
   * Navigate to URL while maintaining the subdomain
   * @param {string} path - Path to navigate to
   */
  export const navigateWithSubdomain = (path) => {
    const url = getSubdomainUrl(path);
    window.location.href = url;
  };