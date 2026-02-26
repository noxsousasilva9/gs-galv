/* ================= PRODUTOS ================= */

const products = [
  {id:1, name:"X-Pratica", price:105, category:"churrasqueira", image:"https://http2.mlstatic.com/D_NQ_NP_2X_857699-MLB99890950672_122025-F.webp"},
  {id:2, name:"Super espetão", price:599, category:"churrasqueira", image:"https://http2.mlstatic.com/D_NQ_NP_2X_709099-MLB76962886483_062024-F.webp"},
  {id:3, name:"Espertão fechada", price:299, category:"agro", image:"https://http2.mlstatic.com/D_NQ_NP_2X_686512-MLA95693895648_102025-F.webp"},
  {id:4, name:"Mini Churrasqueira", price:799, category:"domestico", image:"https://http2.mlstatic.com/D_NQ_NP_2X_765442-MLB54989675664_052023-F.webp"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= RENDER ================= */

function renderProducts(list){
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if(list.length === 0){
    container.innerHTML = "<h2>Nenhum produto encontrado.</h2>";
    return;
  }

  list.forEach(product=>{
    container.innerHTML += `
      <div class="card">
        <img src="${product.image}">
        <h3>${product.name}</h3>
        <div class="price">R$ ${product.price}</div>
        <button class="btn" onclick="addToCart(${product.id})">
          Adicionar ao Carrinho
        </button>
      </div>
    `;
  });
}

/* ================= FILTROS ================= */

function applyFilters(){
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const maxPrice = document.getElementById("priceFilter").value;

  let filtered = products.filter(p=>{
    return (
      p.name.toLowerCase().includes(search) &&
      (category === "all" || p.category === category) &&
      (!maxPrice || p.price <= parseFloat(maxPrice))
    );
  });

  renderProducts(filtered);
}

document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("categoryFilter").addEventListener("change", applyFilters);
document.getElementById("priceFilter").addEventListener("input", applyFilters);

/* ================= CARRINHO ================= */

function addToCart(id){
  const product = products.find(p=>p.id === id);
  const existing = cart.find(item=>item.id === id);

  if(existing){
    existing.quantity++;
  } else {
    cart.push({...product, quantity:1});
  }

  saveCart();
  updateCart();
}

function changeQuantity(id, delta){
  const item = cart.find(i=>i.id === id);
  if(!item) return;

  item.quantity += delta;

  if(item.quantity <= 0){
    removeFromCart(id);
  }

  saveCart();
  updateCart();
}

function removeFromCart(id){
  cart = cart.filter(item=>item.id !== id);
  saveCart();
  updateCart();
}

function updateCart(){
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach(item=>{
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        R$ ${item.price} x ${item.quantity} <br>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="removeFromCart(${item.id})">Remover</button>
      </div>
    `;
  });

  cartCount.innerText = cart.length;
  cartTotal.innerText = total;
}

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("active");
}

/* ================= CHECKOUT ================= */

function goToCheckout(){
  const total = cart.reduce((sum,item)=>sum + item.price*item.quantity, 0);

  if(total === 0){
    alert("Seu carrinho está vazio!");
    return;
  }

  document.getElementById("checkout-total").innerText = total;
  document.getElementById("checkout").classList.remove("hidden");
}

function finishPurchase(){
  alert("Compra finalizada com sucesso!");
  cart = [];
  saveCart();
  updateCart();
  document.getElementById("checkout").classList.add("hidden");
}

/* ================= DARK MODE ================= */

function toggleDarkMode(){
  document.body.classList.toggle("dark");
}

/* ================= INIT ================= */

renderProducts(products);
updateCart();