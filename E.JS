// Ouvrir et fermer le panier
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#Close-cart");

// Vérification de l'existence des éléments
if (cartIcon && cart && closeCart) {
    // Ouvrir le panier
    cartIcon.onclick = () => {
        cart.classList.add("active");
    };

    // Fermer le panier
    closeCart.onclick = () => {
        cart.classList.remove("active");
    };
}

// Vérifier si le document est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

// Initialisation
function ready() {
    // Supprimer un article du panier
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener('click', removeCartItem);
    }

    // Modifier la quantité
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // Ajouter au panier
    var addCartButtons = document.getElementsByClassName('add-cart');
    for (var i = 0; i < addCartButtons.length; i++) {
        var button = addCartButtons[i];
        button.addEventListener('click', addCartClicked);
    }

    // Charger les articles enregistrés
    loadCartItems();
}

// Supprimer un article
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartItems();
}

// Changer la quantité
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

// Ajouter un article au panier
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.getElementsByClassName('product-title')[0].innerText;
    var price = shopProducts.getElementsByClassName('price')[0].innerText;
    var productImg = shopProducts.querySelector('img').src;

    addProductToCart(title, price, productImg);
    updateTotal();
    saveCartItems();
    updateCartIcon();
}

function addProductToCart(title, price, productImg) {
    var cartContent = document.querySelector('.cart-content');
    var cartItemsNames = cartContent.getElementsByClassName('cart-product-title');

    // Vérifier si l'article existe déjà
    for (var i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText === title) {
            alert('Vous avez déjà ajouté cet article au panier');
            return;
        }
    }

    // Créer un nouvel élément de panier
    var cartShopBox = document.createElement('div');
    cartShopBox.classList.add('cart-box');
    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <!-- Supprimer l'article -->
        <i class='bx bx-trash-alt cart-remove'></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartContent.append(cartShopBox);

    // Ajouter des événements pour le nouvel article
    cartShopBox.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    cartShopBox.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

    saveCartItems();
    updateCartIcon();
}

// Mettre à jour le total
function updateTotal() {
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];

        // Récupérer le prix avec décimales et gérer les virgules si nécessaire
        var priceText = priceElement.innerText.replace('£', '').trim().replace(',', '.'); // Enlever £, espace et traiter les virgules
        var price = parseFloat(priceText);

        if (isNaN(price)) price = 0; // Si le prix est incorrect

        var quantity = parseInt(quantityElement.value);
        if (isNaN(quantity)) quantity = 1; // Si la quantité est incorrecte

        total += price * quantity;
    }

    // Arrondir à deux décimales
    total = Math.round(total * 100) / 100;
    document.querySelector('.total-price').innerText = '£' + total.toFixed(2); 

    // Sauvegarder le total dans localStorage
    localStorage.setItem("cartTotal", total);
}

// Sauvegarder les articles du panier dans localStorage
function saveCartItems() {
    var cartContent = document.querySelector('.cart-content');
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var title = cartBox.querySelector('.cart-product-title').innerText;
        var price = cartBox.querySelector('.cart-price').innerText;
        var quantity = cartBox.querySelector('.cart-quantity').value;
        var productImg = cartBox.querySelector('.cart-img').src;

        cartItems.push({
            title: title,
            price: price,
            quantity: quantity,
            productImg: productImg
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Charger les articles du panier à partir de localStorage
function loadCartItems() {
    var cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
        cartItems = JSON.parse(cartItems);
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i];
            addProductToCart(item.title, item.price, item.productImg);
            var cartBoxes = document.getElementsByClassName('cart-box');
            var cartBox = cartBoxes[cartBoxes.length - 1];
            cartBox.querySelector('.cart-quantity').value = item.quantity;
        }
    }

    var cartTotal = localStorage.getItem('cartTotal');
    if (cartTotal) {
        document.querySelector('.total-price').innerText = "£" + cartTotal;
    }

    updateCartIcon();
}

// Mettre à jour l'icône du panier avec le total des articles
function updateCartIcon() {
    var cartBoxes = document.getElementsByClassName('cart-box');
    var quantity = 0;

    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var quantityElement = cartBox.querySelector('.cart-quantity');
        quantity += parseInt(quantityElement.value);
    }

    var cartIcon = document.querySelector('#cart-icon');
    if (cartIcon) {
        cartIcon.setAttribute('data-quantity', quantity);
    }
}

// Script pour filtrer les produits
function searchProducts() {
    let input = document.getElementById('searchBar').value.toLowerCase();
    let products = document.querySelectorAll('.product-box');
    
    products.forEach(product => {
        let title = product.querySelector('.product-title').innerText.toLowerCase();
        if (title.includes(input)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
}
