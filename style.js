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

function getProductPrice(productCard) {
  const priceText = productCard.querySelector('.des h4')?.innerText || '0';
  const normalizedPrice = priceText.replace(',', '.').replace(/[^\d.]/g, '');
  return parseFloat(normalizedPrice) || 0;
}

function getProductData(productCard) {
  const title = productCard.querySelector('.des h5')?.innerText?.trim() || 'Produit Ethica';
  const brand = productCard.querySelector('.des span')?.innerText?.trim() || 'Ethica';
  const priceText = productCard.querySelector('.des h4')?.innerText?.trim() || 'Prix indisponible';
  const oldPrice = productCard.querySelector('.promo-price del')?.innerText?.trim() || '';
  const badge = productCard.querySelector('.promo-badge')?.innerText?.trim() || '';
  const img = productCard.querySelector('img')?.src || '';
  const category = productCard.getAttribute('data-category') || brand;

  return {
    id: img || title,
    title,
    brand,
    price: getProductPrice(productCard),
    priceText,
    oldPrice,
    badge,
    img,
    category,
    quantity: 1
  };
}

function addProductToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      quantity: product.quantity || 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartIconCount(cart);
  showToast(`${product.title} ajouté au panier`);
}

// === Ajout au panier ===
const cartIcons = document.querySelectorAll('.cart');

cartIcons.forEach(icon => {
  icon.addEventListener('click', (e) => {
    e.preventDefault();

    const pro = icon.closest('.pro');
    if (!pro) return;
    addProductToCart(getProductData(pro));
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

  if (!document.querySelector('#cart table')) {
    return;
  }

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

  if (!document.querySelector('#cart table')) {
    return;
  }

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
   



// localStorage.setItem('cart', JSON.stringify([
//   {name:"T-shirt", price:25},
//   {name:"Chaussures", price:50}
// ]));

// localStorage.setItem('cart', JSON.stringify([
//   {id:1, title:"T-shirt", price:25, img:"chemin/vers/tshirt.png", quantity:2},
//   {id:2, title:"Chaussures", price:50, img:"chemin/vers/chaussures.png", quantity:1}
// ]));


// === Mobile menu toggle ===
// bascule la classe `active` sur #navbar quand on clique sur l'icône #bar
document.addEventListener('DOMContentLoaded', () => {
  const bar = document.getElementById('bar');
  const navbar = document.getElementById('navbar');
  const close = document.getElementById('close');

  if (bar && navbar) {
    bar.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });
  }

  if (close && navbar) {
    close.addEventListener('click', (e) => {
      e.preventDefault();
      navbar.classList.remove('active');
    });
  }
});
// ============================================================
// PROMO PAGE — à coller à la fin de script.js
// ============================================================

// === Compte à rebours (2 jours) ===
(function () {
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');
  if (!cdH) return; // on n'est pas sur la page promo

  const end = new Date();
  end.setDate(end.getDate() + 2);
  end.setHours(23, 59, 59, 0);

  function updateCountdown() {
    const diff = end - new Date();
    if (diff <= 0) {
      cdH.textContent = cdM.textContent = cdS.textContent = '00';
      return;
    }
    cdH.textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
    cdM.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    cdS.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

// === Filtres catégorie (page promo) ===
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Activer le bouton cliqué
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      document.querySelectorAll('.promo-card').forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

// === Wishlist (cœur) — page promo ===
(function () {
  document.querySelectorAll('.promo-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const isLiked = btn.classList.toggle('liked');
      btn.textContent = isLiked ? '♥' : '♡';
    });
  });
})();

// === Copier le code promo ===
(function () {
  const couponBtn = document.getElementById('coupon-btn');
  if (!couponBtn) return;

  couponBtn.addEventListener('click', () => {
    navigator.clipboard.writeText('ETHICA20').then(() => {
      const original = couponBtn.textContent;
      couponBtn.textContent = '✔ Copié !';
      setTimeout(() => { couponBtn.textContent = original; }, 2000);
    });
  });
})();

// === Fiche détails produit ===
(function () {
  document.querySelectorAll('.pro[onclick]').forEach(productCard => {
    productCard.removeAttribute('onclick');
  });

  function deliveryWindow() {
    const start = new Date();
    const end = new Date();
    start.setDate(start.getDate() + 3);
    end.setDate(end.getDate() + 5);

    return `${start.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`;
  }

  function buildDescription(product) {
    const category = product.category.toLowerCase();
    if (category.includes('chaussure')) {
      return 'Chaussures confortables pensées pour un usage quotidien, avec une finition soignée et une silhouette facile à associer.';
    }
    if (category.includes('accessoire')) {
      return 'Accessoire pratique et élégant pour compléter une tenue, sélectionné pour son style et sa facilité d’utilisation.';
    }
    return 'Produit sélectionné par Ethica pour un style moderne, agréable à porter au quotidien et facile à intégrer dans votre garde-robe.';
  }

  function ensureProductModal() {
    let modal = document.getElementById('product-detail-modal');
    if (modal) return modal;

    modal = document.createElement('section');
    modal.id = 'product-detail-modal';
    modal.className = 'product-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="product-modal__overlay" data-product-close></div>
      <div class="product-modal__dialog" role="dialog" aria-modal="true" aria-label="Détails du produit">
        <button class="product-modal__close" type="button" data-product-close aria-label="Fermer">&times;</button>
        <div class="product-modal__media">
          <img alt="">
        </div>
        <div class="product-modal__content">
          <span class="product-modal__brand"></span>
          <h2></h2>
          <div class="product-modal__rating">
            <span class="product-modal__stars">★★★★★</span>
            <span>4,7 sur 5 · 128 avis</span>
          </div>
          <div class="product-modal__prices">
            <del></del>
            <strong></strong>
            <span class="product-modal__deal"></span>
          </div>
          <p class="product-modal__description"></p>
          <div class="product-modal__delivery">
            <i class="fas fa-shipping-fast"></i>
            <div>
              <strong>Livraison estimée</strong>
              <span></span>
            </div>
          </div>
          <div class="product-modal__info">
            <div><strong>Retours</strong><span>Retour possible sous 14 jours</span></div>
            <div><strong>Disponibilité</strong><span>En stock</span></div>
            <div><strong>Paiement</strong><span>Sécurisé par carte bancaire</span></div>
          </div>
          <div class="product-modal__options">
            <label>
              Taille
              <select>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </label>
            <label>
              Quantité
              <input type="number" min="1" value="1">
            </label>
          </div>
          <button class="normal product-modal__cart" type="button">Ajouter au panier</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-product-close]').forEach(closeBtn => {
      closeBtn.addEventListener('click', closeProductModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
        closeProductModal();
      }
    });

    return modal;
  }

  function openProductModal(productCard) {
    const product = getProductData(productCard);
    const modal = ensureProductModal();

    modal.querySelector('.product-modal__media img').src = product.img;
    modal.querySelector('.product-modal__media img').alt = product.title;
    modal.querySelector('.product-modal__brand').textContent = product.brand;
    modal.querySelector('h2').textContent = product.title;
    modal.querySelector('.product-modal__prices strong').textContent = product.priceText;
    modal.querySelector('.product-modal__description').textContent = buildDescription(product);
    modal.querySelector('.product-modal__delivery span').textContent = deliveryWindow();

    const oldPrice = modal.querySelector('.product-modal__prices del');
    oldPrice.textContent = product.oldPrice;
    oldPrice.style.display = product.oldPrice ? '' : 'none';

    const deal = modal.querySelector('.product-modal__deal');
    deal.textContent = product.badge || 'Offre limitée';

    const quantityInput = modal.querySelector('.product-modal__options input');
    quantityInput.value = 1;

    const addBtn = modal.querySelector('.product-modal__cart');
    addBtn.onclick = () => {
      const quantity = Math.max(1, parseInt(quantityInput.value, 10) || 1);
      addProductToCart({ ...product, quantity });
      closeProductModal();
    };

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeProductModal() {
    const modal = document.getElementById('product-detail-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click', (event) => {
    const productCard = event.target.closest('.pro');
    if (!productCard) return;
    if (event.target.closest('a, button, input, select, textarea')) return;
    openProductModal(productCard);
  });
})();
