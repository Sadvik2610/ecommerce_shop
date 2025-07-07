const API = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

if (!token) {
  alert('You must log in as admin from index.html first.');
  window.location.href = 'index.html';
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

const productTable = document.getElementById('productTable');
async function loadProducts() {
  const res = await fetch(`${API}/products`, { headers });
  const { data } = await res.json();
  productTable.innerHTML = '';
  data.forEach(p => {
    productTable.innerHTML += `
      <tr data-id="${p.id}">
        <td>${p.id}</td>
        <td><input value="${p.name}" data-field="name"></td>
        <td><input value="${p.description}" data-field="description"></td>
        <td><input value="${p.price}" data-field="price"></td>
        <td><input value="${p.category}" data-field="category"></td>
        <td>
          <button onclick="updateProduct(${p.id})">💾</button>
          <button class="danger" onclick="deleteProduct(${p.id})">🗑</button>
        </td>
      </tr>`;
  });
}

//To Add product
document.getElementById('addForm').onsubmit = async e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(formData)
  });
  if (res.ok) {
    e.target.reset();
    loadProducts();
  } else {
    alert('Failed to add product.');
  }
};

//To Update product
async function updateProduct(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  const body = {};
  row.querySelectorAll('input').forEach(inp => body[inp.dataset.field] = inp.value);
  const res = await fetch(`${API}/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  });
  res.ok ? alert('Updated') : alert('Failed to update');
}

//To Delete product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  const res = await fetch(`${API}/products/${id}`, {
    method: 'DELETE',
    headers
  });
  if (res.ok) loadProducts();
  else alert('Failed to delete product.');
}

//For Logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}

loadProducts();
