import { login, register } from './api.js';

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  const res = await login(email, password);
  if (res.token) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    alert('Login successful!');
    window.location.href = '/dashboard.html';
  } else {
    alert(res.error || 'Login failed');
  }
});
