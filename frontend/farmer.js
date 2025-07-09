import { getFarmerCrops, addCrop } from './api.js';
import { showSection } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const farmerViewBtn = document.getElementById('farmerBtn');
  const addCropBtn = document.getElementById('addCropBtn');
  const farmerSection = document.getElementById('farmerSection');

  if (farmerViewBtn) {
    farmerViewBtn.addEventListener('click', () => {
      loadFarmerCrops();
      showSection('farmerSection');
    });
  }

  if (addCropBtn) {
    addCropBtn.addEventListener('click', showAddCropForm);
  }
});

async function loadFarmerCrops() {
  const grid = document.getElementById('farmerCropsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="loading">Loading crops...</div>';

  try {
    const crops = await getFarmerCrops();
    grid.innerHTML = '';
    if (crops.length === 0) grid.innerHTML = '<p>No crops available.</p>';
    else crops.forEach(crop => {
      const card = document.createElement('div');
      card.className = 'crop-card';
      card.innerHTML = `
        <img src="${crop.image_url || '/default-image.jpg'}" alt="${crop.name}">
        <h3>${crop.name}</h3>
        <p>Sold: ${crop.quantity_sold} kg</p>
        <p>Remaining: ${crop.quantity_available} kg</p>
        <p>Grade: ${crop.grade || '-'}</p>
        <p>Harvest: ${crop.harvest_date || '-'}</p>
      `;
      grid.appendChild(card);
    });
  } catch (error) {
    grid.innerHTML = `<p>Error loading crops: ${error.message}</p>`;
  }
}

function showAddCropForm() {
  const form = document.createElement('form');
  form.innerHTML = `
    <input type="text" name="name" placeholder="Crop name" required>
    <input type="number" name="price" placeholder="Price per kg" step="0.01" required>
    <input type="number" name="quantity_available" placeholder="Quantity" required>
    <input type="text" name="grade" placeholder="Quality grade (e.g., A)">
    <input type="date" name="harvest_date" required>
    <input type="file" name="image" accept="image/*">
    <button type="submit">Add Crop</button>
  `;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const res = await addCrop(formData);
      alert(res.message || 'Crop added!');
      loadFarmerCrops();
      form.remove();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  });
  document.getElementById('farmerCropsGrid').appendChild(form);
}