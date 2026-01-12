/* =========================
   HAMBURGER MENU (Mobile)
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (hamburger && mobileMenu) {
        hamburger.addEventListener("click", () => {
            mobileMenu.style.display =
                mobileMenu.style.display === "flex" ? "none" : "flex";
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.style.display = "none";
            });
        });
    }

    renderCart();
});

/* =========================
   CART SYSTEM (LOCAL STORAGE)
========================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
   TOAST NOTIFICATION
========================= */
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast success";
        document.body.appendChild(toast);
    }

    toast.innerHTML = `🛒 ${message}`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2200);
}

/* =========================
   ADD TO CART (UPDATED)
========================= */
function addToCart(name, size, price, image = "images/default-food.jpg") {
    const item = cart.find(i => i.name === name && i.size === size);

    if (item) {
        item.qty += 1;
        showToast(`${name} (${size}) quantity updated`);
    } else {
        cart.push({
            name,
            size,
            price,
            qty: 1,
            image
        });
        showToast(`${name} (${size}) added to cart`);
    }

    saveCart();
}

/* =========================
   RENDER CART
========================= */
function renderCart() {
    const box = document.getElementById("cartBox");
    const itemsTotalBox = document.getElementById("itemsTotal");
    const deliveryChargeBox = document.getElementById("deliveryCharge");
    const totalBox = document.getElementById("totalPrice");
    const deliverySelect = document.getElementById("deliveryDistance");

    if (!box) return;

    box.innerHTML = "";
    let itemsTotal = 0;

    if (cart.length === 0) {
        box.innerHTML = `
            <div class="empty-cart">
                <div class="cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some delicious food 😋</p>
            </div>
        `;
        if (itemsTotalBox) itemsTotalBox.innerText = "0";
        if (totalBox) totalBox.innerText = "0";
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        itemsTotal += itemTotal;

        const imgSrc = item.image?.trim() || "images/default-food.jpg";

        box.innerHTML += `
        <div class="cart-item">
            <div style="display:flex;gap:15px;align-items:center;">
                <img src="${imgSrc}" alt="${item.name}">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.size}</small>

                    <div class="qty-box">
                        <button onclick="changeQty(${index}, -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
            </div>

            <div class="price">₹${itemTotal}</div>
        </div>`;
    });

    const delivery = deliverySelect ? parseInt(deliverySelect.value) : 30;

    if (itemsTotalBox) itemsTotalBox.innerText = itemsTotal;
    if (deliveryChargeBox) deliveryChargeBox.innerText = delivery;
    if (totalBox) totalBox.innerText = itemsTotal + delivery;
}

/* =========================
   CHANGE QTY
========================= */
function changeQty(index, value) {
    cart[index].qty += value;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
        showToast("Item removed from cart");
    }

    saveCart();
    renderCart();
}

/* =========================
   DELIVERY CHANGE
========================= */
function updateDeliveryCharge() {
    renderCart();
}

/* =========================
   ORDER + WHATSAPP
========================= */
function placeOrder() {
    if (cart.length === 0) {
        showToast("Cart is empty");
        return;
    }
    document.getElementById("customerModal").style.display = "flex";
}

function closeCustomerModal() {
    document.getElementById("customerModal").style.display = "none";
}

function submitCustomerForm(e) {
    e.preventDefault();

    const name = custName.value.trim();
    const phone = custPhone.value.trim();
    const address = custAddress.value.trim();
    const delivery = parseInt(deliveryDistance.value);

    if (!name || !phone || !address) {
        formError.innerText = "All fields are required";
        return;
    }

    let total = 0;
    let msg = `Hello Asif Foods please confirm my order if any query plz call,%0A%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A%0AOrder:%0A`;

    cart.forEach(i => {
        const t = i.price * i.qty;
        total += t;
        msg += `${i.name} (${i.size}) x${i.qty} = ₹${t}%0A`;
    });

    msg += `%0ADelivery: ₹${delivery}%0AGrand Total: ₹${total + delivery}`;

    window.open(`https://wa.me/918969374142?text=${msg}`, "_blank");

    cart = [];
    saveCart();
    renderCart();
    closeCustomerModal();
}
