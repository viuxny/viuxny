let cart = [];
const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartDropdown = document.getElementById("cart-dropdown");
const cartBtn = document.getElementById("cart-btn");

// Añadir productos al carrito
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
  });
});

// Mostrar/ocultar carrito
cartBtn.addEventListener("click", () => {
  cartDropdown.classList.toggle("hidden");
});

// Actualizar carrito
function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  cartItems.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    const info = document.createElement("span");
    info.textContent = `${item.name} - $${item.price * item.quantity}`;

    const controls = document.createElement("div");
    controls.classList.add("item-controls");

  // Botón restar
const minusBtn = document.createElement("button");
minusBtn.textContent = "-";
minusBtn.classList.add("qty-btn", "minus-btn");
minusBtn.addEventListener("click", () => {
  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
});

// Cantidad
const qty = document.createElement("span");
qty.textContent = item.quantity;
qty.classList.add("qty-number");

// Botón sumar
const plusBtn = document.createElement("button");
plusBtn.textContent = "+";
plusBtn.classList.add("qty-btn", "plus-btn");
plusBtn.addEventListener("click", () => {
  item.quantity++;
  updateCart();
});

// Botón eliminar
const removeBtn = document.createElement("button");
removeBtn.textContent = "x";
removeBtn.classList.add("remove-btn");
removeBtn.addEventListener("click", () => {
  cart.splice(index, 1);
  updateCart();
});


    controls.appendChild(minusBtn);
    controls.appendChild(qty);
    controls.appendChild(plusBtn);
    controls.appendChild(removeBtn);

    li.appendChild(info);
    li.appendChild(controls);

    cartItems.appendChild(li);
    totalPrice += item.price * item.quantity;
  });

  cartTotal.textContent = totalPrice.toFixed(2);
}

const checkoutContainer = document.getElementById("checkout-form-container");
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutBtn = document.getElementById("checkout-btn");
const closeCheckout = document.getElementById("close-checkout");

// Mostrar formulario
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }
  checkoutContainer.classList.remove("hidden");
  checkoutOverlay.classList.remove("hidden");
});

// Cerrar al hacer click fuera
checkoutOverlay.addEventListener("click", () => {
  checkoutContainer.classList.add("hidden");
  checkoutOverlay.classList.add("hidden");
});

// Cerrar con la X
closeCheckout.addEventListener("click", () => {
  checkoutContainer.classList.add("hidden");
  checkoutOverlay.classList.add("hidden");
});

// Cerrar con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    checkoutContainer.classList.add("hidden");
    checkoutOverlay.classList.add("hidden");
  }
});



// Inicializa EmailJS con tu clave pública
emailjs.init("g70OMo9gcqJ1Q94B7");

// Mostrar formulario al hacer clic en "Completar compra"

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    document.getElementById("checkout-form-container").classList.remove("hidden");
  });
});


// Enviar pedido por EmailJS
document.getElementById("checkout-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const pago = document.getElementById("pago").value;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const productos = cart.map(item => `${item.name} x${item.quantity} - $${item.price * item.quantity}`).join("\n");

  // mail al cliente
  const templateParams = {
    to_name: nombre,
    to_email: email,
    message: `Gracias por tu compra 💖\n\n${productos}\n\n${pago}`,
    total: total,
    payment_info: "Alias para transferencia: viuky.mp\nO pagar por MP: https://link.mercadopago.com.ar/viuxnyshop"
  };
  
  // mail para vos
  const adminParams = {
    to_name: "Viuxny",
    to_email: "daxteryeehaw@gmail.com", // tu correo
    message: `Nuevo pedido de ${nombre} (${email})\n\n${productos}\n\n${pago}`
  };

  // Enviar ambos correos
  Promise.all([
    emailjs.send("service_1b5m4ql", "template_zjqxjir", templateParams),
    emailjs.send("service_1b5m4ql", "template_9xymn6q", adminParams)
  ])
  .then(() => {
    alert("Pedido enviado correctamente. Revisá tu correo.");
    document.getElementById("checkout-form-container").classList.add("hidden");
    cart.length = 0;
    updateCart();
  })
  .catch(err => {
    console.error("Error al enviar el pedido:", err);
    alert("Ocurrió un error al enviar tu pedido. Intentá de nuevo.");
  });
});






