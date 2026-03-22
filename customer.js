// CUSTOMER DASHBOARD MODULE
let cartItems = [];
let selectedPaymentMethod = 'cash';

document.addEventListener('DOMContentLoaded', function() {
    const session = getCurrentSession();
    if (!session || session.role !== 'customer') {
        window.location.href = '/index.html';
        return;
    }
    document.getElementById('userName').textContent = session.name || 'Customer';
    const initials = (session.name || 'C').split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    
    const today = new Date();
    today.setDate(today.getDate() + 1);
    document.getElementById('pickupDate').valueAsDate = today;
    
    loadBranches();
    loadBrowseProducts();
    loadMyOrders();
});

function switchPage(pageName, event) {
    if (event) event.preventDefault();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    
    const titleMap = {
        'home': 'Welcome',
        'browse': 'Browse Products',
        'reservation': 'Make Reservation',
        'myorders': 'My Orders'
    };
    document.getElementById('pageTitle').textContent = titleMap[pageName] || 'Home';
    
    if (pageName === 'browse') loadBrowseProducts();
    if (pageName === 'myorders') loadMyOrders();
}

function loadBranches() {
    const branches = getBranches();
    const grid = document.getElementById('branchGrid');
    grid.innerHTML = '';
    branches.forEach(b => {
        const card = document.createElement('div');
        card.className = 'branch-card';
        card.innerHTML = `
            <h4><i class="fas fa-map-marker-alt"></i> ${b.name}</h4>
            <p>${b.address}</p>
            <p><strong>Manager:</strong> ${b.manager}</p>
            <p><strong>Phone:</strong> ${b.phone}</p>
        `;
        grid.appendChild(card);
    });
}

function loadBrowseProducts() {
    const products = getProducts();
    const grid = document.getElementById('browseProductGrid');
    grid.innerHTML = '';
    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-browse-card';
        card.innerHTML = `
            <h4>${p.name}</h4>
            <p class="product-category">${p.category}</p>
            <p class="product-price">${formatCurrency(p.price)}</p>
            <button class="btn btn-primary btn-small" onclick="addToReservation('${p.id}')">
                <i class="fas fa-plus"></i> Add to Reservation
            </button>
        `;
        grid.appendChild(card);
    });
}

function loadBranchProducts() {
    loadBrowseProducts(); // Same products for all branches
}

function addToReservation(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const existing = cartItems.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ id: productId, name: product.name, price: product.price, quantity: 1 });
    }
    updateReservationDisplay();
    showNotification(`Added ${product.name} to reservation`, 'success');
}

function updateReservationDisplay() {
    const container = document.getElementById('reservationItems');
    if (cartItems.length === 0) {
        container.innerHTML = '<p class="text-muted">No items selected</p>';
        return;
    }
    
    let html = '';
    cartItems.forEach(item => {
        html += `
            <div class="reservation-item" style="display: flex; justify-content: space-between; padding: var(--spacing-sm) 0; border-bottom: 1px solid var(--border-color);">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
                <button class="btn btn-small btn-danger" onclick="removeReservationItem('${item.id}')">Remove</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

function removeReservationItem(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateReservationDisplay();
}

function submitReservation() {
    if (cartItems.length === 0) {
        showNotification('Please select at least one item', 'warning');
        return;
    }
    const branch = document.getElementById('reservationBranch').value;
    const pickupDate = document.getElementById('pickupDate').value;
    showNotification(`Reservation submitted for ${formatDate(pickupDate)} at branch ${branch}`, 'success');
    cartItems = [];
    updateReservationDisplay();
}

function loadMyOrders() {
    const table = document.getElementById('myOrdersTable');
    const reservations = getReservations({ status: 'confirmed' });
    table.innerHTML = '';
    
    reservations.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.id}</td>
            <td>${r.items.length} items</td>
            <td>${formatDate(r.pickup_date)}</td>
            <td><span class="badge badge-success">Confirmed</span></td>
            <td><button class="btn btn-small" onclick="viewOrderDetails('${r.id}')">View</button></td>
        `;
        table.appendChild(row);
    });
}

function selectPayment(method) {
    selectedPaymentMethod = method;
    showNotification(`Payment method: ${method.toUpperCase()}`, 'info');
}

function completeOrder() {
    showNotification(`Order ready for pickup via ${selectedPaymentMethod.toUpperCase()}`, 'success');
}

function viewOrderDetails(orderId) {
    showNotification(`Viewing details for ${orderId}`, 'info');
}

function showNotification(msg, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('bentahub_session');
    window.location.href = '/index.html';
}
