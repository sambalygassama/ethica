// === Toast Notification ===
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.position = "fixed";
    toast.style.top = "20px";
    toast.style.right = "20px";
    toast.style.backgroundColor = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    toast.style.transition = "opacity 0.5s ease";
    toast.style.opacity = "0";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2500);
}

// === Ajout au panier ===
const cartIcons = document.querySelectorAll('.cart');

cartIcons.forEach(icon => {
  icon.addEventListener('click', (e) => {
    e.preventDefault();

    const pro = icon.closest('.pro');
    const product = {
      id: pro.querySelector('img').src,
      title: pro.querySelector('.des h5').innerText,
      price: parseFloat(pro.querySelector('.des h4').innerText.replace('$', '')),
      img: pro.querySelector('img').src,
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIconCount(cart);
    showToast(`${product.title} ajouté au panier`);
  });
});

// === Mise à jour compteur sur icône panier ===
function updateCartIconCount(cart) {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = count;
  }
}

// === Mise à jour au chargement ===
document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartIconCount(cart);

  const tbody = document.querySelector('#cart table tbody') || createCartTableBody();

  function createCartTableBody() {
    const table = document.querySelector('#cart table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    return tbody;
  }

  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((product, index) => {
    const subtotal = product.price * product.quantity;
    total += subtotal;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><button class="remove" data-index="${index}">&times;</button></td>
      <td><img src="${product.img}" alt="${product.title}" width="50"></td>
      <td>${product.title}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td><input type="number" min="1" value="${product.quantity}" data-index="${index}" class="qty-input"></td>
      <td>$${subtotal.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  // ** Ajout : sauvegarde du total dans localStorage pour la page paiement **
  localStorage.setItem('cartTotal', total.toFixed(2));

  const subtotalElem = document.querySelector('#Subtotal table tr td:nth-child(2)');
  if (subtotalElem) {
    subtotalElem.textContent = `$ ${total.toFixed(2)}`;
  }

  tbody.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.getAttribute('data-index');
      cart.splice(i, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    });
  });

  tbody.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const i = e.target.getAttribute('data-index');
      let val = parseInt(e.target.value);
      if (val < 1) val = 1;
      cart[i].quantity = val;
      localStorage.setItem('cart', JSON.stringify(cart));
      location.reload();
    });
  });
});











document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartIconCount(cart);

  const tbody = document.querySelector('#cart table tbody') || createCartTableBody();

  function createCartTableBody() {
    const table = document.querySelector('#cart table');
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    return tbody;
  }

  function updateCartDisplay() {
    tbody.innerHTML = '';
    let total = 0;

    cart.forEach((product, index) => {
      const subtotal = product.price * product.quantity;
      total += subtotal;

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><button class="remove" data-index="${index}">&times;</button></td>
        <td><img src="${product.img}" alt="${product.title}" width="50"></td>
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td><input type="number" min="1" value="${product.quantity}" data-index="${index}" class="qty-input"></td>
        <td>$${subtotal.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });

    // Sauvegarde total pour la page paiement
    localStorage.setItem('cartTotal', total.toFixed(2));

    const subtotalElem = document.querySelector('#Subtotal table tr td:nth-child(2)');
    if (subtotalElem) {
      subtotalElem.textContent = `$ ${total.toFixed(2)}`;
    }

    updateCartIconCount(cart);

    // Ajout des événements après mise à jour DOM
    tbody.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.getAttribute('data-index');
        cart.splice(i, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();  // MAJ sans reload
      });
    });

    tbody.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const i = e.target.getAttribute('data-index');
        let val = parseInt(e.target.value);
        if (val < 1) val = 1;
        cart[i].quantity = val;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();  // MAJ sans reload
      });
    });
  }

  updateCartDisplay();  // Initial call to fill cart
});
   



document.addEventListener('DOMContentLoaded', () => {
  const totalSpan = document.getElementById('payment-total');
  const discountMsg = document.getElementById('discount-msg');

  // Exemple de panier stocké dans localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Calcul automatique du total
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  totalSpan.textContent = `$${total.toFixed(2)}`;

  document.getElementById('payment-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const coupon = document.getElementById('coupon').value.trim();

    // Code promo exemple
    if(coupon === "PROMO10") {
      total *= 0.9; // 10% de réduction
      discountMsg.textContent = "Code promo appliqué : 10% de réduction !";
    } else {
      discountMsg.textContent = "";
    }

    alert(`Montant total : $${total.toFixed(2)}. Vous serez redirigé vers Stripe.`);

    // Redirection vers Stripe test
    const stripeLink = "https://buy.stripe.com/test_5kQ6oGgGucosfl5cxE6EU00";
    window.location.href = stripeLink;
  });
});
