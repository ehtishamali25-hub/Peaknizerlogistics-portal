import axios from 'axios';

// Use environment variable with fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const downloadFile = async (url, filename) => {
  try {
    // Make sure we're using the full backend URL
    let fullUrl = url;
    if (!url.startsWith('http')) {
      // Remove any trailing slash from API_BASE
      const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
      // Ensure url starts with slash
      const path = url.startsWith('/') ? url : '/' + url;
      fullUrl = `${base}${path}`;
    }
    
    console.log('Downloading from:', fullUrl);
    
    // Get token directly
    const token = localStorage.getItem('token');
    
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    console.log('File size:', blob.size);
    
    if (blob.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    alert(`Download failed: ${error.message}`);
    throw error;
  }
};