document.addEventListener('DOMContentLoaded', () => {
    // === Globals for Cart Management ===
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Carrega o carrinho do Local Storage
    const cartCountElement = document.getElementById('cart-count');

    // Function to update cart count in header
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    };

    // Function to save cart to Local Storage
    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    // Initial update on page load
    updateCartCount();

    // === Sidebar Menu ===
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    if (menuIcon) {
        menuIcon.addEventListener('click', () => {
            sidebar.classList.add('open');
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Close sidebar when clicking a category link (if on index.html) or any sidebar link
    const sidebarLinks = document.querySelectorAll('.sidebar nav ul li a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Check if it's a category link meant for filtering on index.html
            if (event.target.hasAttribute('data-category') && (window.location.pathname.includes('index.html') || window.location.pathname === '/')) {
                event.preventDefault(); // Prevent full page reload
                const selectedCategory = event.target.getAttribute('data-category');
                const productCards = document.querySelectorAll('#productGrid .product-card');

                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (selectedCategory === 'all' || selectedCategory === cardCategory) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
            sidebar.classList.remove('open'); // Close sidebar after click
        });
    });


    // === Product Search & Filter (only on index.html) ===
    if (document.getElementById('products-section')) {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const productGrid = document.getElementById('productGrid');
        const productCards = productGrid.querySelectorAll('.product-card');

        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase();
            productCards.forEach(card => {
                const productName = card.getAttribute('data-name').toLowerCase();
                if (productName.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        if (searchButton) searchButton.addEventListener('click', performSearch);
        if (searchInput) searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });

        const filterButton = document.getElementById('filterButton');
        const filterContent = document.getElementById('filterContent');
        const applyFilterBtn = filterContent.querySelector('.apply-filter-btn');
        const filterCheckboxes = filterContent.querySelectorAll('input[type="checkbox"]');

        if (filterButton) {
            filterButton.addEventListener('click', () => {
                filterContent.classList.toggle('show');
            });
        }

        document.addEventListener('click', (event) => {
            if (filterButton && filterContent && !filterButton.contains(event.target) && !filterContent.contains(event.target)) {
                filterContent.classList.remove('show');
            }
        });

        if (applyFilterBtn) {
            applyFilterBtn.addEventListener('click', () => {
                const selectedFilters = Array.from(filterCheckboxes)
                    .filter(checkbox => checkbox.checked)
                    .map(checkbox => checkbox.value);

                productCards.forEach(card => {
                    const cardName = card.getAttribute('data-name').toLowerCase();
                    let matches = true;

                    if (selectedFilters.length > 0) {
                        matches = selectedFilters.some(filter => cardName.includes(filter));
                    }

                    if (matches) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
                filterContent.classList.remove('show');
            });
        }

        // Add to cart functionality for index.html
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productCard = event.target.closest('.product-card');
                const productId = productCard.dataset.id;
                const productName = productCard.dataset.name;
                const productPrice = parseFloat(productCard.dataset.price);
                const productImage = productCard.querySelector('img').src;

                const existingItem = cart.find(item => item.id === productId);

                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    });
                }
                saveCart();
                alert(`${productName} foi adicionado ao carrinho!`);
            });
        });
    }

    // === Cart Page Logic (cart.html) ===
    if (document.getElementById('cart-items-container')) {
        const cartItemsContainer = document.getElementById('cart-items-container');
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSubtotalElement = document.getElementById('cart-subtotal');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout-button');

        const renderCart = () => {
            cartItemsContainer.innerHTML = ''; // Clear existing items
            if (cart.length === 0) {
                emptyCartMessage.style.display = 'block';
                checkoutButton.disabled = true;
            } else {
                emptyCartMessage.style.display = 'none';
                checkoutButton.disabled = false;
                let subtotal = 0;

                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;

                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('cart-item');
                    cartItemDiv.innerHTML = `
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="decrease-quantity" data-id="${item.id}">-</button>
                            <input type="text" value="${item.quantity}" readonly>
                            <button class="increase-quantity" data-id="${item.id}">+</button>
                        </div>
                        <span class="cart-item-price">R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
                        <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    `;
                    cartItemsContainer.appendChild(cartItemDiv);
                });

                cartSubtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
                // Simulate shipping for display
                const shipping = subtotal > 0 ? 25.00 : 0.00; // Example: R$25 if there are items
                document.getElementById('cart-shipping').textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
                cartTotalElement.textContent = `R$ ${(subtotal + shipping).toFixed(2).replace('.', ',')}`;
            }
        };

        // Event listeners for quantity change and remove
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const itemId = target.dataset.id;

            if (target.classList.contains('increase-quantity')) {
                const item = cart.find(i => i.id === itemId);
                if (item) {
                    item.quantity++;
                    saveCart();
                    renderCart();
                }
            } else if (target.classList.contains('decrease-quantity')) {
                const item = cart.find(i => i.id === itemId);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    saveCart();
                    renderCart();
                }
            } else if (target.classList.contains('remove-item-btn') || target.closest('.remove-item-btn')) {
                const button = target.closest('.remove-item-btn');
                const idToRemove = button.dataset.id;
                cart = cart.filter(item => item.id !== idToRemove);
                saveCart();
                renderCart();
            }
        });

        // Checkout button
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                // In a real app, check if user is logged in, redirect to login or profile if not
                window.location.href = 'checkout.html';
            } else {
                alert('Seu carrinho está vazio!');
            }
        });

        renderCart(); // Initial render of the cart
    }

    // === Profile Page Logic (profile.html) ===
    if (document.getElementById('profileForm')) {
        const profileForm = document.getElementById('profileForm');
        const profileMessage = document.getElementById('profile-message');

        profileForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent form submission

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                profileMessage.textContent = 'As senhas não coincidem!';
                profileMessage.classList.remove('success');
                profileMessage.classList.add('error');
                return;
            }

            // Simulate saving user data to Local Storage (not secure for real app)
            const userData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                password: password, // In a real app, hash this!
                address: {
                    cep: document.getElementById('cep').value,
                    street: document.getElementById('address').value,
                    number: document.getElementById('number').value,
                    complement: document.getElementById('complement').value,
                    neighborhood: document.getElementById('neighborhood').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                }
            };
            localStorage.setItem('userProfile', JSON.stringify(userData));

            profileMessage.textContent = 'Dados salvos com sucesso!';
            profileMessage.classList.remove('error');
            profileMessage.classList.add('success');

            // Optionally, populate fields if user data exists
            // This would be done on page load, if a user is "logged in"
        });

        // Populate form if user data exists in local storage
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (savedProfile) {
            document.getElementById('fullName').value = savedProfile.fullName || '';
            document.getElementById('email').value = savedProfile.email || '';
            // Passwords are not pre-filled for security reasons
            document.getElementById('cep').value = (savedProfile.address && savedProfile.address.cep) || '';
            document.getElementById('address').value = (savedProfile.address && savedProfile.address.street) || '';
            document.getElementById('number').value = (savedProfile.address && savedProfile.address.number) || '';
            document.getElementById('complement').value = (savedProfile.address && savedProfile.address.complement) || '';
            document.getElementById('neighborhood').value = (savedProfile.address && savedProfile.address.neighborhood) || '';
            document.getElementById('city').value = (savedProfile.address && savedProfile.address.city) || '';
            document.getElementById('state').value = (savedProfile.address && savedProfile.address.state) || '';
        }
    }


    // === Checkout Page Logic (checkout.html) ===
    if (document.getElementById('checkout-address')) {
        const stepAddress = document.getElementById('checkout-address');
        const stepPayment = document.getElementById('checkout-payment');
        const stepConfirmation = document.getElementById('checkout-confirmation');

        const stepAddressIndicator = document.getElementById('step-address');
        const stepPaymentIndicator = document.getElementById('step-payment');
        const stepConfirmationIndicator = document.getElementById('step-confirmation');

        const addressForm = document.getElementById('addressForm');
        const paymentForm = document.getElementById('paymentForm');

        const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const creditCardDetails = document.getElementById('credit-card-details');
        const pixDetails = document.getElementById('pix-details');
        const boletoDetails = document.getElementById('boleto-details');

        let currentStep = 1; // 1: Address, 2: Payment, 3: Confirmation

        const showStep = (stepNumber) => {
            stepAddress.classList.remove('active-step');
            stepPayment.classList.remove('active-step');
            stepConfirmation.classList.remove('active-step');

            stepAddressIndicator.classList.remove('active');
            stepPaymentIndicator.classList.remove('active');
            stepConfirmationIndicator.classList.remove('active');

            if (stepNumber === 1) {
                stepAddress.classList.add('active-step');
                stepAddressIndicator.classList.add('active');
            } else if (stepNumber === 2) {
                stepPayment.classList.add('active-step');
                stepPaymentIndicator.classList.add('active');
            } else if (stepNumber === 3) {
                stepConfirmation.classList.add('active-step');
                stepConfirmationIndicator.classList.add('active');
            }
            currentStep = stepNumber;
        };

        // Populate address fields from profile if available
        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (savedProfile && savedProfile.address) {
            document.getElementById('checkoutFullName').value = savedProfile.fullName || '';
            document.getElementById('checkoutCep').value = savedProfile.address.cep || '';
            document.getElementById('checkoutAddress').value = savedProfile.address.street || '';
            document.getElementById('checkoutNumber').value = savedProfile.address.number || '';
            document.getElementById('checkoutComplement').value = savedProfile.address.complement || '';
            document.getElementById('checkoutNeighborhood').value = savedProfile.address.neighborhood || '';
            document.getElementById('checkoutCity').value = savedProfile.address.city || '';
            document.getElementById('checkoutState').value = savedProfile.address.state || '';
        }

        addressForm.addEventListener('submit', (event) => {
            event.preventDefault();
            showStep(2); // Go to Payment step
        });

        paymentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // Simulate payment processing
            alert('Simulando processamento do pagamento...');

            // Clear cart after "purchase"
            cart = [];
            saveCart(); // Save empty cart
            document.getElementById('order-number').textContent = `#${Math.floor(Math.random() * 900000) + 100000}`; // Random order number
            showStep(3); // Go to Confirmation step
        });

        // Handle payment method change
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                creditCardDetails.classList.add('hidden');
                pixDetails.classList.add('hidden');
                boletoDetails.classList.add('hidden');

                if (radio.value === 'credit_card') {
                    creditCardDetails.classList.remove('hidden');
                } else if (radio.value === 'pix') {
                    pixDetails.classList.remove('hidden');
                } else if (radio.value === 'boleto') {
                    boletoDetails.classList.remove('hidden');
                }
            });
        });

        // Navigation buttons for checkout steps
        document.querySelectorAll('.btn-prev-step').forEach(button => {
            button.addEventListener('click', () => {
                if (currentStep > 1) {
                    showStep(currentStep - 1);
                }
            });
        });
        // Note: btn-next-step handled by form submit listeners

        showStep(1); // Start at Address step
    }
});