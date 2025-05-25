document.addEventListener('DOMContentLoaded', () => {

    // --- BANCO DE DADOS SIMULADO DE PRODUTOS ---
    const products = [
        {
            id: 'p001', name: "Bolsa Elegante Couro", price: 199.90,
            image: "/images/Bolsa_Elegante.png", category: 'bolsas',
            description: "Feita com couro legítimo de alta qualidade, esta bolsa elegante combina sofisticação e praticidade. Possui amplo espaço interno, forro em tecido nobre e detalhes metálicos dourados. Perfeita para o dia a dia ou ocasiões especiais.",
            reviews: [
                { user: 'Carla S.', rating: 5, comment: 'Amei a bolsa! Muito mais bonita pessoalmente. Qualidade impecável.' },
                { user: 'Juliana M.', rating: 4, comment: 'Ótima qualidade, tamanho perfeito para o que eu precisava.' }
            ]
        },
        {
            id: 'p002', name: "Mochila Urbana", price: 149.90,
            image: "/images/Mochila_Urbana.png", category: 'mochilas',
            description: "A mochila urbana é ideal para quem busca estilo e conforto. Com design moderno, múltiplos compartimentos e alças ajustáveis, ela é perfeita para carregar seus pertences com segurança e praticidade, seja para o trabalho, estudo ou lazer.",
            reviews: [
                { user: 'Pedro L.', rating: 5, comment: 'Excelente mochila, muito resistente e espaçosa.' }
            ]
        },
        {
            id: 'p003', name: "Necessaire Viagem", price: 59.90,
            image: "/images/Necessaire_Viagem.png", category: 'necessaires',
            description: "Leve seus itens de higiene e beleza com organização e charme. Esta necessaire de viagem é compacta, feita com material resistente à água e possui divisórias internas para facilitar o acesso aos seus produtos.",
            reviews: [
                { user: 'Ana B.', rating: 5, comment: 'Muito prática e o material parece ser bom.' },
                { user: 'Sofia R.', rating: 4, comment: 'Gostei, mas poderia ser um pouquinho maior.' }
            ]
        },
        {
            id: 'p004', name: "Bolsa Transversal", price: 129.90,
            image: "/images/Bolsa_Transversal.png", category: 'bolsas',
            description: "Prática e versátil, a bolsa transversal é um acessório indispensável. Este modelo conta com alça regulável, fecho seguro e um design minimalista que combina com diversos looks. Ideal para quem gosta de ter as mãos livres.",
            reviews: [
                { user: 'Laura F.', rating: 5, comment: 'Adorei! Super estilosa e prática.' }
            ]
        },
        {
            id: 'p005', name: "Mochila Escolar", price: 179.90,
            image: "/images/Mochila_Escolar.png", category: 'mochilas',
            description: "A mochila escolar perfeita para acompanhar a rotina de estudos. Com amplo espaço para livros e cadernos, bolsos laterais para garrafas e um compartimento frontal para itens menores. Material durável e design jovem.",
            reviews: [
                { user: 'Mariana P.', rating: 5, comment: 'Minha filha amou! Cabe tudo e é bem confortável.' }
            ]
        },
        {
            id: 'p006', name: "Necessaire Maquiagem", price: 49.90,
            image: "/images/Necessaire_Maquiagem.png", category: 'necessaires',
            description: "Mantenha suas maquiagens organizadas com esta necessaire compacta e elegante. Possui um espelho interno e elásticos para prender pincéis. Perfeita para levar na bolsa ou em viagens.",
            reviews: [
                { user: 'Gabriela C.', rating: 4, comment: 'Bonita e útil, bom tamanho para o dia a dia.' }
            ]
        }
    ];

    // --- LÓGICA GERAL ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastCloseBtn = document.getElementById('toast-close-btn');

    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) cartCountElement.textContent = totalItems;
    };

    const saveCart = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    const showToast = (message) => {
        if (toastMessage) toastMessage.textContent = message;
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 4000);
        }
    };

    if(toastCloseBtn) toastCloseBtn.addEventListener('click', () => toast && toast.classList.remove('show'));

    const addItemToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity: 1 });
        }
        saveCart();
        showToast(`${product.name} foi adicionado ao carrinho!`);
    };

    updateCartCount(); // Atualiza o contador no carregamento de qualquer página

    // --- SIDEBAR ---
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    if (menuIcon) menuIcon.addEventListener('click', () => sidebar && sidebar.classList.add('open'));
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', () => sidebar && sidebar.classList.remove('open'));
    
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.addEventListener('click', () => sidebar && sidebar.classList.remove('open'));
    });


    // --- LÓGICA DA PÁGINA INICIAL (index.html) ---
    const productGrid = document.getElementById('productGrid');
    if (productGrid) {
        const searchInput = document.getElementById('searchInput');
        const filterCheckboxes = document.querySelectorAll('.filter-checkbox');

        const displayProducts = (filteredProducts = products) => {
            productGrid.innerHTML = ''; // Limpa o grid
            filteredProducts.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.dataset.id = product.id; // Adiciona dataset para filtro
                card.dataset.category = product.category;
                card.dataset.name = product.name.toLowerCase(); // Para filtro de texto

                card.innerHTML = `
                    <a href="product-details.html?id=${product.id}" class="product-card-link">
                        <img src="${product.image}" alt="${product.name}">
                    </a>
                    <div class="product-card-info">
                        <a href="product-details.html?id=${product.id}" class="product-card-link">
                            <h3>${product.name}</h3>
                            <p>R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                        </a>
                        <button class="btn-primary add-to-cart-btn-home" data-id="${product.id}">Adicionar ao Carrinho</button>
                    </div>
                `;
                productGrid.appendChild(card);
            });
             // Reatribui eventos aos novos botões
            document.querySelectorAll('.add-to-cart-btn-home').forEach(button => {
                button.addEventListener('click', (e) => addItemToCart(e.target.dataset.id));
            });
        };
        
        const filterAndSearchProducts = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const activeCategoryFilters = Array.from(document.querySelectorAll('.sidebar nav a[data-category].active'))
                                         .map(el => el.dataset.category);
            const activeAttributeFilters = Array.from(filterCheckboxes)
                                          .filter(cb => cb.checked)
                                          .map(cb => cb.value);

            let tempProducts = products;

            // Filtro por categoria do sidebar
            if (activeCategoryFilters.length > 0 && !activeCategoryFilters.includes('all')) {
                tempProducts = tempProducts.filter(product => activeCategoryFilters.includes(product.category));
            }
            
            // Filtro por atributos (checkboxes) - exemplo simples, pode ser expandido
            if (activeAttributeFilters.length > 0) {
                 tempProducts = tempProducts.filter(product => {
                    // Para esta simulação, vamos verificar se o nome do produto contém algum dos filtros
                    // Em um cenário real, você teria atributos específicos no objeto 'product'
                    return activeAttributeFilters.some(filterAttr => product.name.toLowerCase().includes(filterAttr) || product.description.toLowerCase().includes(filterAttr));
                 });
            }

            // Filtro por termo de busca
            if (searchTerm) {
                tempProducts = tempProducts.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm)
                );
            }
            displayProducts(tempProducts);
        };

        if(searchInput) searchInput.addEventListener('input', filterAndSearchProducts);
        filterCheckboxes.forEach(cb => cb.addEventListener('change', filterAndSearchProducts));
        
        // Filtro de categoria do sidebar
        document.querySelectorAll('.sidebar nav a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const currentActive = document.querySelector('.sidebar nav a[data-category].active');
                if(currentActive) currentActive.classList.remove('active');
                e.currentTarget.classList.add('active');
                filterAndSearchProducts();
                if (sidebar) sidebar.classList.remove('open'); // Fecha sidebar
                 // Rola para a seção de produtos se o link do sidebar for clicado
                const productsSection = document.getElementById('products-section');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Lógica para o botão de toggle do filtro
        const filterButton = document.getElementById('filterButton');
        const filterContent = document.getElementById('filterContent');
        if(filterButton && filterContent){
            filterButton.addEventListener('click', () => filterContent.classList.toggle('show'));
            document.addEventListener('click', (event) => { // Fechar ao clicar fora
                if (!filterButton.contains(event.target) && !filterContent.contains(event.target)) {
                    filterContent.classList.remove('show');
                }
            });
        }
        
        displayProducts(); // Exibe todos os produtos inicialmente
    }


    // --- LÓGICA DA PÁGINA DE DETALHES (product-details.html) ---
    const productDetailContainer = document.getElementById('product-detail-container');
    if (productDetailContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const product = products.find(p => p.id === productId);

        if (product) {
            document.title = `${product.name} - Ale Carrari`;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-image').alt = product.name;
            document.getElementById('product-description').textContent = product.description;

            const reviewsContainer = document.getElementById('reviews-container');
            if (reviewsContainer) {
                if (product.reviews && product.reviews.length > 0) {
                    reviewsContainer.innerHTML = '';
                    product.reviews.forEach(review => {
                        let stars = Array(5).fill(0).map((_, i) => `<i class="fa-star ${i < review.rating ? 'fas' : 'far'}"></i>`).join('');
                        reviewsContainer.innerHTML += `
                            <div class="review-card">
                                <div class="review-header">
                                    <h4>${review.user}</h4>
                                    <div class="review-rating">${stars}</div>
                                </div>
                                <p class="review-body">${review.comment}</p>
                            </div>
                        `;
                    });
                } else {
                    reviewsContainer.innerHTML = '<p>Ainda não há avaliações para este produto.</p>';
                }
            }

            const addToCartBtnDetail = document.getElementById('add-to-cart-btn-detail');
            const buyNowBtnDetail = document.getElementById('buy-now-btn-detail');

            if(addToCartBtnDetail) addToCartBtnDetail.addEventListener('click', () => addItemToCart(productId));
            if(buyNowBtnDetail) buyNowBtnDetail.addEventListener('click', () => {
                addItemToCart(productId);
                setTimeout(() => { window.location.href = 'checkout.html'; }, 300);
            });

        } else {
            productDetailContainer.innerHTML = '<h1 class="product-name-large">Produto não encontrado.</h1><p>O produto que você está procurando não existe ou foi removido.</p><a href="index.html" class="btn-primary">Voltar à Loja</a>';
        }
    }

    // --- LÓGICA DA PÁGINA DO CARRINHO (cart.html) ---
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (cartItemsContainer) {
        const emptyCartMessage = document.getElementById('empty-cart-message');
        const cartSubtotalEl = document.getElementById('cart-subtotal');
        const cartShippingEl = document.getElementById('cart-shipping');
        const cartTotalEl = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout-button');

        const renderCart = () => {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                if(emptyCartMessage) {
                    cartItemsContainer.appendChild(emptyCartMessage);
                    emptyCartMessage.style.display = 'block';
                }
                if(checkoutButton) checkoutButton.disabled = true;
                 if(cartSubtotalEl) cartSubtotalEl.textContent = 'R$ 0,00';
                if(cartShippingEl) cartShippingEl.textContent = 'R$ 0,00';
                if(cartTotalEl) cartTotalEl.textContent = 'R$ 0,00';
            } else {
                if(emptyCartMessage) emptyCartMessage.style.display = 'none';
                if(checkoutButton) checkoutButton.disabled = false;
                let subtotal = 0;

                cart.forEach(item => {
                    subtotal += item.price * item.quantity;
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
                        <span class="cart-item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        <button class="remove-item-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    `;
                    cartItemsContainer.appendChild(cartItemDiv);
                });

                const shipping = subtotal > 0 ? 15.00 : 0.00; // Exemplo de frete fixo
                if(cartSubtotalEl) cartSubtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
                if(cartShippingEl) cartShippingEl.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
                if(cartTotalEl) cartTotalEl.textContent = `R$ ${(subtotal + shipping).toFixed(2).replace('.', ',')}`;
            }
        };

        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            const button = target.closest('button');
            if (!button) return;

            const itemId = button.dataset.id;
            const itemIndex = cart.findIndex(i => i.id === itemId);
            if(itemIndex === -1 && !button.classList.contains('remove-item-btn')) return;


            if (button.classList.contains('increase-quantity')) {
                cart[itemIndex].quantity++;
            } else if (button.classList.contains('decrease-quantity')) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity--;
                } else { // Se for 1 e diminuir, remove o item
                    cart.splice(itemIndex, 1);
                }
            } else if (button.classList.contains('remove-item-btn')) {
                 const itemToRemoveIndex = cart.findIndex(i => i.id === button.dataset.id);
                 if(itemToRemoveIndex > -1) cart.splice(itemToRemoveIndex, 1);
            }
            saveCart();
            renderCart();
        });

        if(checkoutButton) checkoutButton.addEventListener('click', () => window.location.href = 'checkout.html');
        renderCart();
    }

    // --- LÓGICA DA PÁGINA DE PERFIL (profile.html) ---
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        const profileMessage = document.getElementById('profile-message');

        profileForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                profileMessage.textContent = 'As senhas não coincidem!';
                profileMessage.className = 'hidden-message error';
                return;
            }
            
            const userData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                // Em um app real, a senha seria 'hasheada' no backend
                address: {
                    cep: document.getElementById('cep').value, street: document.getElementById('address').value,
                    number: document.getElementById('number').value, complement: document.getElementById('complement').value,
                    neighborhood: document.getElementById('neighborhood').value, city: document.getElementById('city').value,
                    state: document.getElementById('state').value
                }
            };
            localStorage.setItem('userProfile', JSON.stringify(userData));
            profileMessage.textContent = 'Dados salvos com sucesso!';
            profileMessage.className = 'hidden-message success';
        });

        const savedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (savedProfile) {
            document.getElementById('fullName').value = savedProfile.fullName || '';
            document.getElementById('email').value = savedProfile.email || '';
            if(savedProfile.address){
                document.getElementById('cep').value = savedProfile.address.cep || '';
                document.getElementById('address').value = savedProfile.address.street || '';
                document.getElementById('number').value = savedProfile.address.number || '';
                document.getElementById('complement').value = savedProfile.address.complement || '';
                document.getElementById('neighborhood').value = savedProfile.address.neighborhood || '';
                document.getElementById('city').value = savedProfile.address.city || '';
                document.getElementById('state').value = savedProfile.address.state || '';
            }
        }
    }

    // --- LÓGICA DA PÁGINA DE CHECKOUT (checkout.html) ---
    if (document.getElementById('checkout-address')) {
        const stepsContent = {
            address: document.getElementById('checkout-address'),
            payment: document.getElementById('checkout-payment'),
            confirmation: document.getElementById('checkout-confirmation')
        };
        const stepsIndicators = {
            address: document.getElementById('step-address'),
            payment: document.getElementById('step-payment'),
            confirmation: document.getElementById('step-confirmation')
        };
        const addressForm = document.getElementById('addressForm');
        const paymentForm = document.getElementById('paymentForm');
        const paymentMethodRadios = document.querySelectorAll('input[name="paymentMethod"]');
        const paymentDetailsDivs = {
            credit_card: document.getElementById('credit-card-details'),
            pix: document.getElementById('pix-details'),
            boleto: document.getElementById('boleto-details')
        };

        const showStep = (stepName) => {
            Object.values(stepsContent).forEach(content => content.classList.remove('active-step'));
            Object.values(stepsIndicators).forEach(indicator => indicator.classList.remove('active'));
            
            if(stepsContent[stepName]) stepsContent[stepName].classList.add('active-step');
            if(stepsIndicators[stepName]) stepsIndicators[stepName].classList.add('active');

            // Ativa indicadores dos passos anteriores
            const stepOrder = ['address', 'payment', 'confirmation'];
            const currentStepIndex = stepOrder.indexOf(stepName);
            for(let i=0; i < currentStepIndex; i++){
                if(stepsIndicators[stepOrder[i]]) stepsIndicators[stepOrder[i]].classList.add('active');
            }
        };

        const savedCheckoutProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (savedCheckoutProfile) {
            document.getElementById('checkoutFullName').value = savedCheckoutProfile.fullName || '';
            if(savedCheckoutProfile.address){
                document.getElementById('checkoutCep').value = savedCheckoutProfile.address.cep || '';
                document.getElementById('checkoutAddress').value = savedCheckoutProfile.address.street || '';
                document.getElementById('checkoutNumber').value = savedCheckoutProfile.address.number || '';
                document.getElementById('checkoutComplement').value = savedCheckoutProfile.address.complement || '';
                document.getElementById('checkoutNeighborhood').value = savedCheckoutProfile.address.neighborhood || '';
                document.getElementById('checkoutCity').value = savedCheckoutProfile.address.city || '';
                document.getElementById('checkoutState').value = savedCheckoutProfile.address.state || '';
            }
        }
        
        if(addressForm) addressForm.addEventListener('submit', e => { e.preventDefault(); showStep('payment'); });
        
        if(paymentForm) paymentForm.addEventListener('submit', e => {
            e.preventDefault();
            showToast('Processando pagamento... Pedido realizado com sucesso!'); // Substituindo alert
            cart = [];
            saveCart();
            const orderNumberEl = document.getElementById('order-number');
            if(orderNumberEl) orderNumberEl.textContent = `#${Math.floor(Math.random() * 900000) + 100000}`;
            showStep('confirmation');
        });
        
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                Object.values(paymentDetailsDivs).forEach(div => div && div.classList.add('hidden'));
                if(paymentDetailsDivs[radio.value]) paymentDetailsDivs[radio.value].classList.remove('hidden');
            });
        });

        document.querySelectorAll('.btn-prev-step').forEach(button => {
            button.addEventListener('click', () => {
                if(stepsContent.payment.classList.contains('active-step')) showStep('address');
            });
        });
        
        showStep('address'); // Inicia no passo de endereço
    }
});