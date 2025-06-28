// Ejecutar funciones al cargar la página
window.onload = function () {
    productList("product-list");
    lastProduct("last-product");
};

let allProducts = []; // Variable global para almacenar todos los productos

// Función para listar todos los productos
let productList = async (containerId, filterCategory = null) => {
    try {
        const petition = await fetch("http://localhost:8081/product", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!petition.ok) throw new Error("Error al cargar los productos");

        const products = await petition.json();
        allProducts = products; // Guarda todos los productos

        let filteredProducts = products;
        if (filterCategory) {
            filteredProducts = products.filter(p => p.category === filterCategory);
        }

        let productCardsHTML = ""; // Acumulador para todas las tarjetas

        filteredProducts.forEach((product) => {
            productCardsHTML += `
                <div class="col-md-4">
                    <div class="card mb-4 product-wap rounded-0" data-id="${product.id}" onclick="handleCardClick(${product.id})">
                        <div class="card rounded-0 position-relative">
                            <img class="card-img rounded-0 img-fluid" src="${product.image}" alt="${product.name}" style="height: 300px">
                            <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
                                <!-- Efecto hover vacío, sin botones -->
                            </div>
                        </div>
                        <div class="card-body">
                            <a href="shop-single.html?id=${product.id}" class="h3 text-decoration-none">${product.name}</a>
                            <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
                                <li class="pt-2">
                                    <span class="product-color-dot color-dot-red float-left rounded-circle ml-1"></span>
                                    <span class="product-color-dot color-dot-blue float-left rounded-circle ml-1"></span>
                                    <span class="product-color-dot color-dot-black float-left rounded-circle ml-1"></span>
                                    <span class="product-color-dot color-dot-light float-left rounded-circle ml-1"></span>
                                    <span class="product-color-dot color-dot-green float-left rounded-circle ml-1"></span>
                                </li>
                            </ul>
                            <ul class="list-unstyled d-flex justify-content-center mb-1">
                                <li>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-warning fa fa-star"></i>
                                    <i class="text-muted fa fa-star"></i>
                                    <i class="text-muted fa fa-star"></i>
                                </li>
                            </ul>
                            <p class="text-center mb-0">$${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;
        });

        const container = document.querySelector(`#${containerId}`);
        if (container) {
            container.innerHTML = productCardsHTML;
        } else {
            console.error(`El contenedor con ID '${containerId}' no existe.`);
        }

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};

// Función para listar los últimos 3 productos
let lastProduct = async (containerId) => {
    try {
        const petition = await fetch("http://localhost:8081/product", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!petition.ok) throw new Error("Error al cargar los productos");

        const products = await petition.json();
        const lastThreeProducts = products.slice(-3); // Obtener los últimos 3 productos
        let lastProductHTML = ""; // Acumulador para las tarjetas de los últimos productos

        lastThreeProducts.forEach((product) => {
            lastProductHTML += `<div class="col-12 col-md-4 mb-4">
                <div class="card h-100">
                  <a href="shop-single.html?id=${product.id}">
                    <img
                      src="${product.image}"
                      class="card-img-top"
                      alt="${product.name}"
                      style="height: 300px"
                    />
                  </a>
                  <div class="card-body">
                    <ul class="list-unstyled d-flex justify-content-between">
                      <li>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-warning fa fa-star"></i>
                        <i class="text-muted fa fa-star"></i>
                        <i class="text-muted fa fa-star"></i>
                      </li>
                      <li class="text-muted text-right">$${product.price.toFixed(2)}</li>
                    </ul>
                    <a
                      href="shop-single.html?id=${product.id}"
                      class="h2 text-decoration-none text-dark"
                      >${product.name}</a
                    >
                    <p class="card-text">
                      ${product.description || "Descripción no disponible."}
                    </p>
                    <p class="text-muted">Reviews (${product.reviews || 0})</p>
                  </div>
                </div>
              </div>`;
        });

        const container = document.querySelector(`#${containerId}`);
        if (container) {
            container.innerHTML = lastProductHTML;
        } else {
            console.error(`El contenedor con ID '${containerId}' no existe.`);
        }

    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
};

// Función para manejar el clic en una tarjeta
const handleCardClick = async (productId) => {
    try {
        const response = await fetch(`http://localhost:8081/product/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!response.ok) throw new Error("Error al obtener el producto");

        const product = await response.json();

        console.log("Producto obtenido:", product);

        // Redirigir a la página de detalles del producto
        window.location.href = `shop-single.html?id=${productId}`;

    } catch (error) {
        console.error("Error al obtener el producto:", error);
    }
};

const fetchProductDetails = async (productId) => {
    try {
        const response = await fetch(`http://localhost:8081/product/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (!response.ok) throw new Error("Error al obtener los detalles del producto");

        const product = await response.json();
        displayProductDetails(product);
    } catch (error) {
        console.error("Error al obtener los detalles del producto:", error);
    }
};

// Obtener el ID del producto desde la URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
    fetchProductDetails(productId);
} else {
    console.error("No se proporcionó un ID de producto en la URL.");
}

const displayProductDetails = (product) => {

    document.getElementById("product-detail").src = product.image;

    document.querySelector(".card-body h1").textContent = product.name;
    document.querySelector(".card-body .h3").textContent = `$${product.price.toFixed(2)}`;
    document.querySelector(".card-body p.description").textContent = product.description || "Descripción no disponible.";

    const carouselInner = document.querySelector(".carousel-inner");
    carouselInner.innerHTML = `
        <div class="carousel-item active">
            <div class="row">
                <div class="col-4">
                    <a href="#">
                        <img class="card-img img-fluid" src="assets/img/product_single_01.jpg" alt="Product Image 1" />
                    </a>
                </div>
                <div class="col-4">
                    <a href="#">
                        <img class="card-img img-fluid" src="assets/img/product_single_02.jpg" alt="Product Image 2" />
                    </a>
                </div>
                <div class="col-4">
                    <a href="#">
                        <img class="card-img img-fluid" src="assets/img/product_single_03.jpg" alt="Product Image 3" />
                    </a>
                </div>
            </div>
        </div>
    `;
};

document.addEventListener("DOMContentLoaded", () => {
    // Cantidad de producto
    const quantityInput = document.getElementById("product-quantity");
    const quantityDisplay = document.getElementById("var-value");
    const btnMinus = document.getElementById("btn-minus");
    const btnPlus = document.getElementById("btn-plus");

    if (btnMinus && btnPlus && quantityInput && quantityDisplay) {
        btnMinus.addEventListener("click", () => {
            let currentQuantity = parseInt(quantityInput.value, 10);
            if (currentQuantity > 1) {
                currentQuantity--;
                quantityInput.value = currentQuantity;
                quantityDisplay.textContent = currentQuantity;
            }
        });

        btnPlus.addEventListener("click", () => {
            let currentQuantity = parseInt(quantityInput.value, 10);
            currentQuantity++;
            quantityInput.value = currentQuantity;
            quantityDisplay.textContent = currentQuantity;
        });
    }

    // Carrito
    const cartButton = document.querySelector(".fa-cart-arrow-down");
    const cartContainer = document.getElementById("cart-container");
    const closeCartButton = document.getElementById("close-cart");
    const cartItemsList = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");

    if (cartButton && cartContainer) {
        cartButton.addEventListener("click", (e) => {
            e.preventDefault();
            cartContainer.classList.toggle("d-none");
        });
    }

    if (closeCartButton && cartContainer) {
        closeCartButton.addEventListener("click", () => {
            cartContainer.classList.add("d-none");
        });
    }

    // Actualizar el contador del carrito
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    };

    // Actualizar la interfaz del carrito
    const updateCartUI = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartItemsList = document.getElementById("cart-items");
        const emptyMsg = document.getElementById("empty-cart-message");
        if (cartItemsList) cartItemsList.innerHTML = "";

        if (cart.length === 0) {
            if (emptyMsg) emptyMsg.classList.remove("d-none");
        } else {
            if (emptyMsg) emptyMsg.classList.add("d-none");
            cart.forEach((item) => {
                const listItem = document.createElement("li");
                listItem.classList.add("mb-2");
                listItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <span>${item.name} (x${item.quantity})</span>
                        <span>$${item.price}</span>
                        <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">Eliminar</button>
                    </div>
                `;
                if (cartItemsList) cartItemsList.appendChild(listItem);
            });

            // Agregar eventos a los botones "Eliminar"
            const removeButtons = document.querySelectorAll(".remove-item");
            removeButtons.forEach((button) => {
                button.addEventListener("click", (e) => {
                    const productId = e.target.getAttribute("data-id");
                    removeFromCart(productId);
                });
            });
        }
        updateCartCount();
    };

    // Función para eliminar un producto del carrito
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart = cart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    }

    // Cargar el carrito al iniciar la página
    updateCartUI();
});

// Registro
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                name: document.getElementById('name').value,
                last_name: document.getElementById('lastName').value,
                phoneNumber: document.getElementById('phone').value || null
            };
            const message = document.getElementById('registerMessage');
            try {
                const response = await fetch('http://localhost:8081/api/users/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Error en el registro');
                }
                // Registro exitoso - guardar usuario y redirigir
                localStorage.setItem('user', JSON.stringify(data));
                message.innerHTML = `<span class="text-success">¡Registro exitoso! Bienvenido/a, ${data.name}</span>`;
                setTimeout(() => window.location.href = "index.html", 1500);
            } catch (err) {
                message.innerHTML = `<span class="text-danger">${err.message}</span>`;
            }
        });
    }
});

// Login
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const message = document.getElementById('loginMessage');
            try {
                const response = await fetch('http://localhost:8081/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Credenciales incorrectas');
                }
                const user = await response.json();
                localStorage.setItem('user', JSON.stringify(user));
                message.innerHTML = `<span class="text-success">¡Bienvenido/a, ${user.name}!</span>`;

                // ACTUALIZA EL SALUDO EN EL NAVBAR SI EXISTE (por si el login es en la misma página)
                const userGreeting = document.getElementById("user-greeting");
                if (userGreeting) {
                    userGreeting.innerHTML = `
                        <span class="nav-link">Bienvenido/a, ${user.name} ${user.last_name}</span>
                    `;
                }

                setTimeout(() => window.location.href = "index.html", 1000);
            } catch (err) {
                message.innerHTML = `<span class="text-danger">${err.message}</span>`;
            }
        });
    }
});

// Saludo de usuario en el navbar (solo un bloque, al final)
document.addEventListener("DOMContentLoaded", () => {
    const userGreeting = document.getElementById("user-greeting");
    const user = JSON.parse(localStorage.getItem("user"));
    if (userGreeting) {
        if (user && user.name) {
            userGreeting.innerHTML = `
                <span class="nav-link">Bienvenido/a, ${user.name}${user.last_name ? ' ' + user.last_name : ''}</span>
            `;
        } else {
            userGreeting.innerHTML = `
                <a class="nav-icon position-relative text-decoration-none" href="logIn.html">
                    <i class="fa fa-fw fa-user text-dark mr-3"></i>
                </a>
            `;
        }
    }
});

// Redirige a index.html si ya hay usuario logueado
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    // Solo redirige si estamos en logIn.html
    if (
        user && user.name &&
        (window.location.pathname.endsWith("logIn.html") || window.location.pathname.endsWith("login.html"))
    ) {
        window.location.href = "index.html";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.getElementById("checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", async function (e) {
            e.preventDefault();

            // Obtén el carrito del localStorage
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (cart.length === 0) {
                alert("El carrito está vacío.");
                return;
            }

            // Calcula el total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            try {
                // Envía el monto al backend
                const response = await fetch("http://localhost:8081/api/webpay-rest/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `amount=${total}`
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error("Error al iniciar la transacción: " + errorText);
                }

                const data = await response.json();

                // Si tu backend responde con una URL de pago, redirige al usuario
                if (data && data.url && data.token) {
                    // Redirige a la URL de WebPay con el token
                    const form = document.createElement("form");
                    form.method = "POST";
                    form.action = data.url;

                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = "token_ws";
                    input.value = data.token;
                    form.appendChild(input);

                    document.body.appendChild(form);
                    form.submit();
                } else {
                    alert("No se pudo obtener la URL de pago.");
                }
            } catch (err) {
                alert("Error al procesar el pago: " + err.message);
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            // Obtén los datos del producto desde el DOM
            const productId = new URLSearchParams(window.location.search).get("id");
            const name = document.getElementById("product-name")?.textContent || "";
            const priceText = document.getElementById("product-price")?.textContent || "";
            const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
            const image = document.getElementById("product-detail")?.src || "";
            const quantity = parseInt(document.getElementById("product-quantity")?.value, 10) || 1;

            if (!productId || !name || !price) {
                alert("No se pudo agregar el producto al carrito.");
                return;
            }

            // Obtén el carrito actual
            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            // Verifica si el producto ya está en el carrito
            const existing = cart.find(item => item.id == productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name,
                    price,
                    image,
                    quantity
                });
            }

            // Guarda el carrito actualizado
            localStorage.setItem("cart", JSON.stringify(cart));

            // Recarga la página automáticamente
            window.location.reload();
        });
    }
});

// Agrega el evento para filtrar por categoría
document.addEventListener("DOMContentLoaded", () => {
    const categoryLinks = document.querySelectorAll(".category-link");
    categoryLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const category = this.getAttribute("data-category");
            productList("product-list", category);
        });
    });
});