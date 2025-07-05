// frontend/farmer.js
import { getFarmerCrops, addCrop } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const farmerViewBtn = document.getElementById('farmerBtn');
  if (farmerViewBtn) {
    farmerViewBtn.addEventListener('click', () => {
      loadFarmerCrops();
      showFarmerView();
    });
  }

  const addCropBtn = document.getElementById('addCropBtn');
  if (addCropBtn) {
    addCropBtn.addEventListener('click', showAddCropForm);
  }
});

async function loadFarmerCrops() {
  const grid = document.getElementById('farmerCropsGrid');
  grid.innerHTML = '';
  const crops = await getFarmerCrops();

  crops.forEach(crop => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    card.innerHTML = `
      <img src="${crop.image_url}" alt="${crop.name}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">${crop.name}</h3>
        <p class="text-gray-600">Sold: ${crop.quantity_sold} kg</p>
        <p class="text-gray-600">Remaining: ${crop.quantity_available} kg</p>
        <p class="text-gray-600 text-sm mt-2">Grade: ${crop.grade || '-'}</p>
        <p class="text-gray-600 text-sm">Harvest: ${crop.harvest_date || '-'}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function showAddCropForm() {
  const name = prompt('Crop name:');
  const price = prompt('Price per kg:');
  const quantity = prompt('Available quantity:');
  const grade = prompt('Quality grade (e.g., A, B+):');
  const harvest = prompt('Harvest date (YYYY-MM-DD):');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('quantity_available', quantity);
      formData.append('grade', grade);
      formData.append('harvest_date', harvest);
      formData.append('image', file);

      const res = await addCrop(formData);
      alert(res.message || 'Crop added!');
      loadFarmerCrops();
    }
  };
  fileInput.click();
}
// frontend/farmer.js
import { getFarmerCrops, addCrop } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
  const farmerViewBtn = document.getElementById('farmerBtn');
  if (farmerViewBtn) {
    farmerViewBtn.addEventListener('click', () => {
      loadFarmerCrops();
      showFarmerView();
    });
  }

  const addCropBtn = document.getElementById('addCropBtn');
  if (addCropBtn) {
    addCropBtn.addEventListener('click', showAddCropForm);
  }
});

async function loadFarmerCrops() {
  const grid = document.getElementById('farmerCropsGrid');
  grid.innerHTML = '';
  const crops = await getFarmerCrops();

  crops.forEach(crop => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    card.innerHTML = `
      <img src="${crop.image_url}" alt="${crop.name}" class="w-full h-48 object-cover">
      <div class="p-4">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">${crop.name}</h3>
        <p class="text-gray-600">Sold: ${crop.quantity_sold} kg</p>
        <p class="text-gray-600">Remaining: ${crop.quantity_available} kg</p>
        <p class="text-gray-600 text-sm mt-2">Grade: ${crop.grade || '-'}</p>
        <p class="text-gray-600 text-sm">Harvest: ${crop.harvest_date || '-'}</p>
      </div>
    `;
    grid.appendChild(card);
  });
}

function showAddCropForm() {
  const name = prompt('Crop name:');
  const price = prompt('Price per kg:');
  const quantity = prompt('Available quantity:');
  const grade = prompt('Quality grade (e.g., A, B+):');
  const harvest = prompt('Harvest date (YYYY-MM-DD):');

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = async () => {
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('quantity_available', quantity);
      formData.append('grade', grade);
      formData.append('harvest_date', harvest);
      formData.append('image', file);

      const res = await addCrop(formData);
      alert(res.message || 'Crop added!');
      loadFarmerCrops();
    }
  };
  fileInput.click();
}
