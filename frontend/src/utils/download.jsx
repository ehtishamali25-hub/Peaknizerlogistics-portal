import axios from 'axios';

// Use environment variable with fallback to localhost
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const downloadFile = async (url, filename) => {
  try {
    let fullUrl = url;
    if (!url.startsWith('http')) {
      const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
      const path = url.startsWith('/') ? url : '/' + url;
      fullUrl = `${base}${path}`;
    }
    
    console.log('Downloading from:', fullUrl);
    
    const token = localStorage.getItem('token');
    const response = await fetch(fullUrl, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // ✅ NEW: Handle expired token
    if (response.status === 401) {
      alert('Your session expired. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const blob = await response.blob();
    console.log('File size:', blob.size);
    if (blob.size === 0) throw new Error('Downloaded file is empty');
    
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Download error:', error);
    alert(`Download failed: ${error.message}`);
    throw error;
  }
};