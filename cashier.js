// ========================================
// CASHIER DASHBOARD MODULE
// ========================================

let cartItems = [];
let selectedPaymentMethod = 'cash';
let userBranch = 'B001';

document.addEventListener('DOMContentLoaded', function() {
    initializeCashierDashboard();
});

function initializeCashierDashboard() {
    const session = getCurrentSession();
    if (!session || session.role !== 'cashier') {
        window.location.href = '/index.html';
        return;
    }

    userBranch = session.branch || 'B001';
    document.getElementById('userName').textContent = session.name || 'Cashier';
    const initials = (session.name || 'C').split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;

    loadPOSProducts();
    loadInventoryData();
}

function switchPage(pageName, event) {
    if (event) event.preventDefault();
    
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageName);
    if (page) page.classList.add('active');

    document.querySelectorAll('.sidebar-nav-link').forEach(link => link.classList.remove('active'));
    event?.target.closest('.sidebar-nav-link')?.classList.add('active');

    const titleMap = {
        'pos': 'Point of Sale System',
        'monitoring': 'Stock Availability Check',
        'reservations': 'Confirm Reservations',
        'payments': 'Validate Payments'
    };

    document.getElementById('pageTitle').textContent = titleMap[pageName] || 'POS';

    if (pageName === 'monitoring') loadInventoryData();
    if (pageName === 'reservations') loadReservationData();
}

function loadPOSProducts() {
    const products = getProducts();
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="product-price">${formatCurrency(product.price)}</p>
            </div>
            <button class="btn btn-small btn-primary" onclick="addToCart('${product.id}')">
                <i class="fas fa-plus"></i> Add
            </button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartDisplay();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cart = document.getElementById('posCart');
    
    if (cartItems.length === 0) {
        cart.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-shopping-cart"></i></div>
                <p class="empty-message">No items added</p>
            </div>
        `;
        document.getElementById('subtotal').textContent = '₱0.00';
        document.getElementById('grandTotal').textContent = '₱0.00';
        return;
    }

    let html = '';
    let subtotal = 0;

    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">${formatCurrency(item.price)} x ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-small" onclick="decreaseQuantity('${item.id}')">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <p class="cart-item-total">${formatCurrency(itemTotal)}</p>
            </div>
        `;
    });

    cart.innerHTML = html;
    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    updateTotal();
}

function decreaseQuantity(productId) {
    const item = cartItems.find(i => i.id === productId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(productId);
            return;
        }
    }
    updateCartDisplay();
}

function updateTotal() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = subtotal - discount;
    document.getElementById('grandTotal').textContent = formatCurrency(total);
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.method-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.method-btn').classList.add('active');
}

function completeSale() {
    if (cartItems.length === 0) {
        showNotification('Add items to cart first', 'warning');
        return;
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const total = subtotal - discount;

    showNotification(`Sale completed! Total: ${formatCurrency(total)} (${selectedPaymentMethod.toUpperCase()})`, 'success');
    
    // Reset cart
    cartItems = [];
    document.getElementById('discount').value = '';
    updateCartDisplay();
}

function cancelSale() {
    if (cartItems.length > 0) {
        if (confirm('Are you sure you want to cancel this transaction?')) {
            cartItems = [];
            document.getElementById('discount').value = '';
            updateCartDisplay();
            showNotification('Transaction cancelled', 'warning');
        }
    }
}

function loadInventoryData() {
    const inventory = getInventoryByBranch(userBranch);
    const table = document.getElementById('inventoryTable');
    table.innerHTML = '';

    inventory.forEach(item => {
        const product = getProductById(item.product_id);
        if (!product) return;

        const status = item.quantity > item.reorder_level ? 'In Stock' : 'Low Stock';
        const statusClass = item.quantity > item.reorder_level ? 'badge-success' : 'badge-danger';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${item.quantity}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>${item.reorder_level}</td>
        `;
        table.appendChild(row);
    });
}

function loadReservationData() {
    const reservations = getReservations({ branch_id: userBranch, status: 'pending' });
    const table = document.getElementById('reservationTable');
    table.innerHTML = '';

    reservations.forEach(res => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.customer}</td>
            <td>${res.items.length} items</td>
            <td>${formatDate(res.date)}</td>
            <td><span class="badge badge-warning">Pending</span></td>
            <td>
                <button class="btn btn-small btn-success" onclick="confirmRes('${res.id}')">Confirm</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function confirmRes(resId) {
    showNotification(`Reservation ${resId} confirmed`, 'success');
}

function validatePayment() {
    const transactionId = document.getElementById('paymentTransactionId').value;
    const amount = document.getElementById('paymentAmount').value;

    if (!transactionId || !amount) {
        showNotification('Please fill in all fields', 'warning');
        return;
    }

    showNotification(`Payment ${transactionId} validated: ${formatCurrency(amount)}`, 'success');
    document.getElementById('paymentTransactionId').value = '';
    document.getElementById('paymentAmount').value = '';
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('bentahub_session');
    window.location.href = '/index.html';
}

// Update total when discount changes
document.addEventListener('change', function(e) {
    if (e.target.id === 'discount') {
        updateTotal();
    }
});
