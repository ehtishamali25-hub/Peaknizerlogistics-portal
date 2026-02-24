import axios from 'axios'; // Use axios directly, not the instance

const API_BASE = 'http://localhost:8000';

export const downloadFile = async (url, filename) => {
  try {
    // Make sure we're using the full backend URL
    let fullUrl = url;
    if (!url.startsWith('http')) {
      fullUrl = `${API_BASE}${url}`;
    }
    
    console.log('Downloading from:', fullUrl);
    
    // Get token directly
    const token = localStorage.getItem('token');
    
    // Use fetch instead of axiosInstance to avoid any baseURL conflicts
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
    
    // Create blob link to download
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