import { getCrops, placeOrder } from './api.js';
import { showSection } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const customerBtn = document.getElementById('customerBtn');
  if (customerBtn) {
    customerBtn.addEventListener('click', () => {
      loadCrops();
      showSection('marketSection');
    });
  }
});

async function loadCrops() {
  const container = document.getElementById('crop-list');
  if (!container) return;
  container.innerHTML = '<div class="loading">Loading crops...</div>';

  try {
    const crops = await getCrops();
    container.innerHTML = '';
    if (crops.length === 0) container.innerHTML = '<p>No crops available.</p>';
    else {
      const fragment = document.createDocumentFragment();
      crops.forEach(crop => {
        const card = document.createElement('div');
        card.className = 'crop-card';
        card.innerHTML = `
          <img src="${crop.image_url || '/default-image.jpg'}" alt="${crop.name}">
          <h3>${crop.name}</h3>
          <p>₹${crop.price} / kg</p>
          <input type="number" min="1" max="${crop.quantity_available}" value="1" class="quantity-input">
          <button onclick="orderCrop(${crop.id})">Buy Now</button>
        `;
        fragment.appendChild(card);
      });
      container.appendChild(fragment);
    }
  } catch (error) {
    container.innerHTML = `<p>Error loading crops: ${error.message}</p>`;
  }
}

window.orderCrop = async (cropId) => {
  const quantityInput = document.querySelector(`[onclick="orderCrop(${cropId})"] + .quantity-input`);
  const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
  const paymentMethod = document.getElementById('paymentMethod')?.value || 'upi';

  try {
    const res = await placeOrder(cropId, quantity, paymentMethod);
    alert(res.message || 'Order placed!');
    showSection('paymentSection');
    document.getElementById('orderCrop').textContent = res.crop_name || 'Unknown';
    document.getElementById('orderQuantity').textContent = quantity;
    document.getElementById('orderTotal').textContent = `₹${(quantity * res.price).toFixed(2)}`;
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
};

window.filterCrops = () => {
  const query = document.getElementById('cropSearch').value.toLowerCase();
  loadCrops().then(() => {
    if (query) {
      document.querySelectorAll('.crop-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = name.includes(query) ? 'block' : 'none';
      });
    }
  });
};