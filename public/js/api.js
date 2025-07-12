// API Configuration
const API_BASE_URL = window.location.origin;

// Utility functions
const getToken = () => localStorage.getItem('token');
const setToken = (token) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
const authAPI = {
  // User registration
  signup: async (userData) => {
    return apiRequest('/userModel/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // User login
  login: async (credentials) => {
    const response = await apiRequest('/userModel/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      setToken(response.token);
    }
    
    return response;
  },

  // User logout
  logout: () => {
    removeToken();
    window.location.href = '/login';
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  }
};

// User API
const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/userModel/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/userModel/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Get all public users
  getPublicUsers: async () => {
    return apiRequest('/userModel');
  },

  // Get specific user
  getUser: async (userId) => {
    return apiRequest(`/userModel/${userId}`);
  }
};

// Swap Request API
const swapRequestAPI = {
  // Create new swap request
  create: async (requestData) => {
    return apiRequest('/swapReq', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  // Get user's swap requests
  getAll: async (type = 'all', status = null) => {
    const params = new URLSearchParams({ type });
    if (status) params.append('status', status);
    return apiRequest(`/swapReq?${params}`);
  },

  // Get specific swap request
  getById: async (requestId) => {
    return apiRequest(`/swapReq/${requestId}`);
  },

  // Update swap request status
  updateStatus: async (requestId, status) => {
    return apiRequest(`/swapReq/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Delete swap request
  delete: async (requestId) => {
    return apiRequest(`/swapReq/${requestId}`, {
      method: 'DELETE'
    });
  }
};

// Feedback API
const feedbackAPI = {
  // Send feedback
  send: async (feedbackData) => {
    return apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  },

  // Get user's feedback
  getAll: async (type = 'all') => {
    return apiRequest(`/feedback?type=${type}`);
  },

  // Get specific feedback
  getById: async (feedbackId) => {
    return apiRequest(`/feedback/${feedbackId}`);
  },

  // Update feedback
  update: async (feedbackId, message) => {
    return apiRequest(`/feedback/${feedbackId}`, {
      method: 'PUT',
      body: JSON.stringify({ message })
    });
  },

  // Delete feedback
  delete: async (feedbackId) => {
    return apiRequest(`/feedback/${feedbackId}`, {
      method: 'DELETE'
    });
  },

  // Get feedback for a specific user
  getUserFeedback: async (userId) => {
    return apiRequest(`/feedback/user/${userId}`);
  }
};

// Export APIs
window.authAPI = authAPI;
window.userAPI = userAPI;
window.swapRequestAPI = swapRequestAPI;
window.feedbackAPI = feedbackAPI; 