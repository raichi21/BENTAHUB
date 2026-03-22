// ========================================
// ADMIN DASHBOARD MODULE
// ========================================

let currentPage = 'dashboard';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminDashboard();
});

/**
 * Initialize Admin Dashboard
 */
function initializeAdminDashboard() {
    // Check authentication
    const session = getCurrentSession();
    if (!session || session.role !== 'admin') {
        window.location.href = '/index.html';
        return;
    }

    // Update user info
    updateUserInfo(session);

    // Load dashboard data
    loadDashboardStats();
    loadBranchPerformance();
    
    // Set active page
    switchPage('dashboard', null);
}

/**
 * Update User Info Display
 */
function updateUserInfo(session) {
    document.getElementById('userName').textContent = session.name || 'Admin User';
    document.getElementById('userRole').textContent = 'Administrator';
    
    const initials = (session.name || 'AU').split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
}

/**
 * Load Dashboard Stats
 */
function loadDashboardStats() {
    const branches = getBranches();
    const sales = getSalesData();
    const today = new Date().toISOString().split('T')[0];
    const todaySales = getSalesData({ date: today });

    // Update stat cards
    document.getElementById('totalBranches').textContent = branches.length;
    document.getElementById('todaySales').textContent = formatCurrency(
        todaySales.reduce((sum, s) => sum + s.total, 0)
    );

    // Calculate total inventory
    const inventory = getAllInventory();
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('totalInventory').textContent = totalItems.toLocaleString();

    // Count low stock items
    const lowStockItems = inventory.filter(item => item.quantity <= item.reorder_level).length;
    document.getElementById('lowStockCount').textContent = lowStockItems;
}

/**
 * Load Branch Performance
 */
function loadBranchPerformance() {
    const branches = getBranches();
    const sales = getSalesData();
    const today = new Date().toISOString().split('T')[0];

    const table = document.getElementById('branchTable');
    table.innerHTML = '';

    branches.forEach(branch => {
        const branchSales = sales.filter(s => s.branch_id === branch.id && s.date === today);
        const totalSales = branchSales.reduce((sum, s) => sum + s.total, 0);
        const transactions = branchSales.length;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${branch.name}</td>
            <td>${branch.manager}</td>
            <td>${transactions}</td>
            <td>${formatCurrency(totalSales)}</td>
            <td><span class="badge badge-success"><i class="fas fa-check-circle"></i> Active</span></td>
            <td>
                <button class="btn btn-small" onclick="viewBranchDetails('${branch.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        table.appendChild(row);
    });
}

/**
 * Switch Between Pages
 */
function switchPage(pageName, event) {
    if (event) {
        event.preventDefault();
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    // Update sidebar
    document.querySelectorAll('.sidebar-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event && event.target.closest('.sidebar-nav-link')?.classList.add('active');

    // Update page title
    const titleMap = {
        'dashboard': 'Dashboard Overview',
        'monitoring': 'Centralized Monitoring',
        'sales': 'Sales Report',
        'reservations': 'Reservation Management',
        'qr': 'QR Code Management',
        'payments': 'Payment Management',
        'pickup': 'Pickup Management',
        'profile': 'Admin Profile'
    };

    document.getElementById('pageTitle').textContent = titleMap[pageName] || 'Dashboard';
    currentPage = pageName;

    // Load page specific data
    loadPageData(pageName);
}

/**
 * Load Page-Specific Data
 */
function loadPageData(pageName) {
    switch(pageName) {
        case 'monitoring':
            updateMonitoring();
            break;
        case 'sales':
            filterSales();
            break;
        case 'reservations':
            filterReservations();
            break;
        case 'qr':
            loadQRProducts();
            break;
        case 'payments':
            loadPaymentsData();
            break;
        case 'pickup':
            loadPickupData();
            break;
    }
}

/**
 * MONITORING MODULE
 */
function updateMonitoring() {
    const branchId = document.getElementById('monitoringBranch')?.value || 'all';
    let inventory = getAllInventory();

    if (branchId !== 'all') {
        inventory = inventory.filter(item => item.branch_id === branchId);
    }

    const table = document.getElementById('inventoryTable');
    table.innerHTML = '';

    inventory.forEach(item => {
        const product = getProductById(item.product_id);
        if (!product) return;

        const status = item.quantity > item.reorder_level ? 'Adequate' : 'Low Stock';
        const statusClass = item.quantity > item.reorder_level ? 'badge-success' : 'badge-danger';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${item.quantity}</td>
            <td>${item.reorder_level}</td>
            <td><span class="badge ${statusClass}">${status}</span></td>
            <td>${formatDate(item.last_updated)}</td>
        `;
        table.appendChild(row);
    });
}

function refreshMonitoring() {
    updateMonitoring();
    showNotification('Inventory data refreshed', 'success');
}

/**
 * SALES MODULE
 */
function filterSales() {
    const date = document.getElementById('salesDate')?.value || new Date().toISOString().split('T')[0];
    const branch = document.getElementById('salesBranch')?.value || '';

    let sales = getSalesData({ date: date });
    if (branch) {
        sales = sales.filter(s => s.branch_id === branch);
    }

    // Update summary
    const totalAmount = sales.reduce((sum, s) => sum + s.total, 0);
    const totalItems = sales.length;
    const avgTransaction = totalItems > 0 ? totalAmount / totalItems : 0;

    document.getElementById('totalSalesAmount').textContent = formatCurrency(totalAmount);
    document.getElementById('totalTransactions').textContent = totalItems;
    document.getElementById('avgTransaction').textContent = formatCurrency(avgTransaction);

    // Update table
    const table = document.getElementById('salesTable');
    table.innerHTML = '';

    sales.forEach(sale => {
        const branch = getBranchById(sale.branch_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${branch?.name || 'Unknown'}</td>
            <td>${formatDate(sale.date)}, ${formatTime(sale.time)}</td>
            <td>${sale.items}</td>
            <td>${formatCurrency(sale.total)}</td>
            <td>${sale.cashier}</td>
            <td><span class="badge badge-success">Completed</span></td>
        `;
        table.appendChild(row);
    });
}

function exportSalesReport() {
    showNotification('Sales report exported to CSV', 'success');
}

/**
 * RESERVATIONS MODULE
 */
function filterReservations() {
    const status = document.getElementById('reservationStatus')?.value || '';
    const branchId = document.getElementById('reservationBranch')?.value || '';

    let reservations = getReservations();

    if (status) {
        reservations = reservations.filter(r => r.status === status);
    }
    if (branchId) {
        reservations = reservations.filter(r => r.branch_id === branchId);
    }

    const table = document.getElementById('reservationsTable');
    table.innerHTML = '';

    reservations.forEach(res => {
        const branch = getBranchById(res.branch_id);
        const statusClass = res.status === 'pending' ? 'badge-warning' : 
                          res.status === 'confirmed' ? 'badge-success' : 'badge-primary';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.id}</td>
            <td>${res.customer}</td>
            <td>${branch?.name || 'Unknown'}</td>
            <td>${res.items.length} items</td>
            <td>${formatDate(res.pickup_date)}</td>
            <td><span class="badge ${statusClass}">${res.status.charAt(0).toUpperCase() + res.status.slice(1)}</span></td>
            <td>
                <button class="btn btn-small btn-success" onclick="confirmReservation('${res.id}')">Confirm</button>
                <button class="btn btn-small btn-danger" onclick="cancelReservation('${res.id}')">Cancel</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function refreshReservations() {
    filterReservations();
    showNotification('Reservations updated', 'success');
}

function confirmReservation(id) {
    showNotification(`Reservation ${id} confirmed`, 'success');
}

function cancelReservation(id) {
    showNotification(`Reservation ${id} cancelled`, 'warning');
}

/**
 * QR MANAGEMENT MODULE
 */
function loadQRProducts() {
    const products = getProducts();
    const table = document.getElementById('productTable');
    table.innerHTML = '';

    products.slice(0, 8).forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${formatCurrency(product.price)}</td>
            <td><button class="btn btn-small" onclick="showQRCode('${product.id}')"><i class="fas fa-qrcode"></i></button></td>
            <td>
                <button class="btn btn-small" onclick="editProduct('${product.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-small btn-danger" onclick="deleteProduct('${product.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        table.appendChild(row);
    });
}

function showQRCode(productId) {
    const product = getProductById(productId);
    if (product) {
        showNotification(`QR Code for ${product.name}: ${product.qr_code}`, 'success');
    }
}

function editProduct(productId) {
    showNotification(`Edit mode for product ${productId}`, 'info');
}

function deleteProduct(productId) {
    showNotification(`Product ${productId} deleted`, 'danger');
}

function simulateQRScan() {
    const input = document.getElementById('qrInput')?.value;
    if (input) {
        showNotification(`QR Code scanned: ${input}`, 'success');
    }
}

/**
 * PAYMENTS MODULE
 */
function loadPaymentsData() {
    const payments = getPayments();
    const table = document.getElementById('paymentsTable');
    table.innerHTML = '';

    payments.forEach(payment => {
        const methodBadge = payment.method === 'cash' ? 'badge-primary' : 'badge-warning';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${payment.id}</td>
            <td>${payment.transaction_id}</td>
            <td>${formatCurrency(payment.amount)}</td>
            <td><span class="badge ${methodBadge}">${payment.method.toUpperCase()}</span></td>
            <td>${formatDate(payment.date)}, ${formatTime(payment.time)}</td>
            <td>${getBranchById(payment.branch)?.name || 'Unknown'}</td>
            <td><span class="badge badge-success">Verified</span></td>
            <td>
                <button class="btn btn-small" onclick="viewPaymentDetails('${payment.id}')"><i class="fas fa-eye"></i></button>
            </td>
        `;
        table.appendChild(row);
    });
}

function viewPaymentDetails(paymentId) {
    showNotification(`Viewing payment details for ${paymentId}`, 'info');
}

/**
 * PICKUP MODULE
 */
function loadPickupData() {
    const reservations = getReservations({ status: 'confirmed' });
    const table = document.getElementById('pickupTable');
    table.innerHTML = '';

    reservations.forEach(res => {
        const branch = getBranchById(res.branch_id);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${res.id}</td>
            <td>${res.customer}</td>
            <td>${branch?.name || 'Unknown'}</td>
            <td>${res.items.length}</td>
            <td>${formatDate(res.pickup_date)}</td>
            <td><span class="badge badge-warning">Pending</span></td>
            <td>
                <button class="btn btn-small btn-success" onclick="confirmPickup('${res.id}')">Confirm</button>
                <button class="btn btn-small" onclick="viewPickupDetails('${res.id}')">View</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function confirmPickup(orderId) {
    showNotification(`Pickup ${orderId} confirmed`, 'success');
}

function viewPickupDetails(orderId) {
    showNotification(`Viewing pickup details for ${orderId}`, 'info');
}

function viewBranchDetails(branchId) {
    switchPage('monitoring', null);
    document.getElementById('monitoringBranch').value = branchId;
    updateMonitoring();
}

/**
 * MODAL FUNCTIONS
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function applyFilters() {
    filterSales();
    closeModal('filterModal');
}

/**
 * NOTIFICATIONS
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'danger' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * LOGOUT
 */
function logout(event) {
    if (event) {
        event.preventDefault();
    }
    localStorage.removeItem('bentahub_session');
    localStorage.removeItem('bentahub_user');
    window.location.href = '/index.html';
}

// Add modal click-outside functionality
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});
