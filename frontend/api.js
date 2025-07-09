const API_BASE = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export async function login(email, password) {
  return fetchWithRetry(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
}

export async function register(data) {
  return fetchWithRetry(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

export async function getCrops() {
  return fetchWithRetry(`${API_BASE}/crops`, { headers: getAuthHeaders() });
}

export async function placeOrder(crop_id, quantity, payment_method = 'upi') {
  return fetchWithRetry(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ crop_id, quantity, payment_method })
  });
}

export async function getFarmerCrops() {
  return fetchWithRetry(`${API_BASE}/crops/farmer/mine`, { headers: getAuthHeaders() });
}

export async function addCrop(formData) {
  return fetchWithRetry(`${API_BASE}/crops`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });
}

export async function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

export function showSection(sectionId) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(sectionId);
  if (section) section.classList.add('active');
}