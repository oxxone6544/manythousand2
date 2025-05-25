const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElem = document.getElementById("cart-total");

// Load cart from localStorage or empty object
let cart = JSON.parse(localStorage.getItem("manythousandCart")) || {};

function saveCart() {
  localStorage.setItem("manythousandCart", JSON.stringify(cart));
}

function formatPrice(num) {
  return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  const keys = Object.keys(cart);
  if (keys.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Keranjang kosong</p>';
    cartTotalElem.textContent = "Total: Rp 0";
    return;
  }

  let total = 0;
  keys.forEach((id) => {
    const item = cart[id];
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <span>${formatPrice(item.price * item.qty)}</span>
      <button onclick="removeItem('${id}')" style="background:none;border:none;color:crimson;cursor:pointer;font-weight:bold;">&times;</button>
    `;
    cartItemsContainer.appendChild(div);
  });
  cartTotalElem.textContent = "Total: " + formatPrice(total);
}

function addItem(id, name, price) {
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { name, price, qty: 1 };
  }
  saveCart();
  renderCart();
}

function removeItem(id) {
  if (!cart[id]) return;
  cart[id].qty--;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

document.querySelectorAll(".buy-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const productDiv = button.closest(".product");
    const id = productDiv.dataset.id;
    const name = productDiv.dataset.name;
    const price = parseInt(productDiv.dataset.price);
    addItem(id, name, price);
  });
});

renderCart();

document.getElementById("checkout-btn").addEventListener("click", () => {
  const keys = Object.keys(cart);
  if (keys.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let message = "Halo, saya mau pesan produk:\n";
  let total = 0;

  keys.forEach((id) => {
    const item = cart[id];
    const subTotal = item.price * item.qty;
    total += subTotal;
    message += `- ${item.name} x${item.qty} = ${formatPrice(subTotal)}\n`;
  });

  message += `\nTotal: ${formatPrice(total)}\n`;
  message += `\nNama saya: [isi nama kamu di sini]`;

  const phone = "6281440028098"; // Ganti dengan nomor WhatsApp kamu
  const encodedMessage = encodeURIComponent(message);
  const waLink = `https://wa.me/${phone}?text=${encodedMessage}`;

  window.open(waLink, "_blank");
});
