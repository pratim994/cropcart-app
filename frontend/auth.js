import { login, logout } from './api.js';
import { showSection } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      try {
        const res = await login(email, password);
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          loginMessage.textContent = 'Login successful!';
          setTimeout(() => {
            const userType = res.user.user_type;
            showSection(userType === 'farmer' ? 'farmerSection' : 'marketSection');
          }, 1000);
        } else {
          loginMessage.textContent = res.error || 'Login failed';
        }
      } catch (error) {
        loginMessage.textContent = `Error: ${error.message}`;
      }
    });
  }

  const logoutBtn = document.createElement('button');
  logoutBtn.textContent = 'Logout';
  logoutBtn.addEventListener('click', logout);
  document.querySelector('.header').appendChild(logoutBtn);
});