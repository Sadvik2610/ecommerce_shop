const API = "http://localhost:5000/api";
let token = localStorage.getItem("token") || null;
let currentPage = 1;
const limit = 6;

const $ = q => document.querySelector(q);
const $$ = q => document.querySelectorAll(q);

const loginBtn = $("#loginBtn");
const registerBtn = $("#registerBtn");
const logoutBtn = $("#logoutBtn");
const userSpan = $("#userSpan");
const modal = $("#modal");
const authForm = $("#authForm");
const formTitle = $("#formTitle");
const usernameField = authForm.querySelector('[name="username"]');
const emailField = authForm.querySelector('[name="email"]');
const passField = authForm.querySelector('[name="password"]');

const productList = $("#productList");
const cartList = $("#cartList");
const placeOrderBtn = $("#placeOrderBtn");
const paginationDiv = $("#pagination");

function openModal(mode) {
  formTitle.textContent = mode === "login" ? "Login" : "Register";
  usernameField.hidden = mode === "login";
  modal.classList.remove("hidden");
  authForm.dataset.mode = mode;
}
function closeModal() { modal.classList.add("hidden"); authForm.reset(); }

loginBtn.onclick = () => openModal("login");
registerBtn.onclick = () => openModal("register");
logoutBtn.onclick = () => { localStorage.removeItem("token"); token = null; setAuthUI(); };
modal.onclick = e => { if (e.target === modal) closeModal(); };

authForm.onsubmit = async e => {
  e.preventDefault();
  const mode = e.target.dataset.mode;
  const body = { email: emailField.value, password: passField.value };
  if (mode === "register") body.username = usernameField.value;

  const res = await fetch(`${API}/auth/${mode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.ok && mode === "login") {
    token = data.token; localStorage.setItem("token", token); setAuthUI(); closeModal();
  } else if (res.ok) { alert("Registered ✔ Now log in"); closeModal(); }
  else alert(data.message || "Error");
};

function setAuthUI() {
  if (token) {
    loginBtn.hidden = registerBtn.hidden = true;
    logoutBtn.hidden = userSpan.hidden = false;
    try {
      const role = JSON.parse(atob(token.split('.')[1])).role;
      userSpan.textContent = `Role: ${role}`;
    } catch { userSpan.textContent = "Logged in"; }
    placeOrderBtn.hidden = false;
  } else {
    loginBtn.hidden = registerBtn.hidden = false;
    logoutBtn.hidden = userSpan.hidden = true;
    placeOrderBtn.hidden = true;
  }
  loadProducts(); loadCart();
}
setAuthUI();

async function loadProducts(page = 1) {
  currentPage = page;
  const res = await fetch(`${API}/products?page=${page}&limit=${limit}`);
  const { data, pages } = await res.json();

  productList.innerHTML = data.map(p => `
    <div class="card">
      <strong>${p.name}</strong>
      <small>₹${p.price.toFixed(2)}</small>
      <button data-id="${p.id}" ${!token ? "disabled":""}>Add to cart</button>
    </div>`).join("");

  $$("#productList button").forEach(btn =>
    btn.onclick = () => addToCart(btn.dataset.id)
  );

  paginationDiv.innerHTML = [...Array(pages).keys()]
    .map(i => `<button ${i+1===page?'class="primary"':''}>${i+1}</button>`).join("");
  $$("#pagination button").forEach((b,i)=>
    b.onclick = () => loadProducts(i+1)
  );
}

async function loadCart() {
  if(!token) return cartList.innerHTML="";
  const res = await fetch(`${API}/cart`, { headers:{ Authorization:`Bearer ${token}` }});
  const items = await res.json();
  cartList.innerHTML = items.map(it=>`
    <li><span>${it.Product.name} × ${it.quantity}</span>
    <button data-id="${it.productId}">&times;</button></li>`).join("");
  $$("#cartList button").forEach(btn=>
    btn.onclick = () => removeFromCart(btn.dataset.id)
  );
}

async function addToCart(id){
  await fetch(`${API}/cart`,{
    method:'POST',
    headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${token}`},
    body:JSON.stringify({ productId:id, quantity:1 })
  });
  loadCart();
}
async function removeFromCart(id){
  await fetch(`${API}/cart/${id}`,{
    method:'DELETE',
    headers:{ Authorization:`Bearer ${token}` }
  });
  loadCart();
}
placeOrderBtn.onclick = async ()=>{
  const res = await fetch(`${API}/orders`,{
    method:'POST',
    headers:{ Authorization:`Bearer ${token}` }
  });
  if(res.ok){ alert("Order placed 🛒"); loadCart(); }
  else alert("Cart empty");
};
