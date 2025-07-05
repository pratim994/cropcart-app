import { getCrops } from './api.js';

async function loadCrops() {
  const crops = await getCrops();
  const container = document.getElementById('crop-list');
  container.innerHTML = '';

  crops.forEach(crop => {
    container.innerHTML += `
      <div class="crop-card">
        <img src="${crop.image_url}" alt="${crop.name}" />
        <h3>${crop.name}</h3>
        <p>₹${crop.price} / kg</p>
        <button onclick="orderCrop(${crop.id})">Buy Now</button>
      </div>
    `;
  });
}
window.onload = loadCrops;
