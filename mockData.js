// ========================================
// MOCK DATA MODULE - Simulates Backend Database
// ========================================

// Initialize Mock Data Storage
function initializeMockData() {
    // Check if data already exists
    if (!localStorage.getItem('bentahub_branches')) {
        localStorage.setItem('bentahub_branches', JSON.stringify(BRANCHES));
        localStorage.setItem('bentahub_products', JSON.stringify(PRODUCTS));
        localStorage.setItem('bentahub_inventory', JSON.stringify(INVENTORY));
        localStorage.setItem('bentahub_sales', JSON.stringify(SALES));
        localStorage.setItem('bentahub_reservations', JSON.stringify(RESERVATIONS));
        localStorage.setItem('bentahub_payments', JSON.stringify(PAYMENTS));
    }
}

// ========================================
// BRANCHES DATA
// ========================================
const BRANCHES = [
    {
        id: 'B001',
        name: 'Lourdes Main Branch',
        address: '123 Main Street, Lourdes',
        phone: '(555) 123-4567',
        manager: 'Maria Santos',
        status: 'active'
    },
    {
        id: 'B002',
        name: 'Downtown Branch',
        address: '456 Downtown Ave, City Center',
        phone: '(555) 234-5678',
        manager: 'Juan Dela Cruz',
        status: 'active'
    },
    {
        id: 'B003',
        name: 'Westside Branch',
        address: '789 West Street, Westside',
        phone: '(555) 345-6789',
        manager: 'Carmen Lopez',
        status: 'active'
    },
    {
        id: 'B004',
        name: 'Market District Branch',
        address: '321 Market Lane, District',
        phone: '(555) 456-7890',
        manager: 'Rosa Rivera',
        status: 'active'
    }
];

// ========================================
// PRODUCTS DATA
// ========================================
const PRODUCTS = [
    { id: 'P001', name: 'Rice (1kg)', category: 'Dry Goods', price: 45.00, sku: 'RICE001', qr_code: 'QR001' },
    { id: 'P002', name: 'Cooking Oil (1L)', category: 'Cooking', price: 85.00, sku: 'OIL001', qr_code: 'QR002' },
    { id: 'P003', name: 'Sugar (500g)', category: 'Pantry', price: 55.00, sku: 'SUGAR001', qr_code: 'QR003' },
    { id: 'P004', name: 'Coffee (250g)', category: 'Beverages', price: 120.00, sku: 'COFFEE001', qr_code: 'QR004' },
    { id: 'P005', name: 'Milk (1L)', category: 'Dairy', price: 65.00, sku: 'MILK001', qr_code: 'QR005' },
    { id: 'P006', name: 'Bread (500g)', category: 'Bakery', price: 35.00, sku: 'BREAD001', qr_code: 'QR006' },
    { id: 'P007', name: 'Butter (200g)', category: 'Dairy', price: 95.00, sku: 'BUTTER001', qr_code: 'QR007' },
    { id: 'P008', name: 'Noodles (5 packs)', category: 'Snacks', price: 50.00, sku: 'NOODLES001', qr_code: 'QR008' },
    { id: 'P009', name: 'Canned Beans (400g)', category: 'Pantry', price: 35.00, sku: 'BEANS001', qr_code: 'QR009' },
    { id: 'P010', name: 'Soap Bar (100g)', category: 'Household', price: 25.00, sku: 'SOAP001', qr_code: 'QR010' },
    { id: 'P011', name: 'Shampoo (500ml)', category: 'Personal Care', price: 120.00, sku: 'SHAMP001', qr_code: 'QR011' },
    { id: 'P012', name: 'Toothpaste (120g)', category: 'Personal Care', price: 35.00, sku: 'TOOTHP001', qr_code: 'QR012' }
];

// ========================================
// INVENTORY DATA
// ========================================
const INVENTORY = [
    // Lourdes Main Branch
    { branch_id: 'B001', product_id: 'P001', quantity: 150, reorder_level: 50, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P002', quantity: 80, reorder_level: 30, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P003', quantity: 120, reorder_level: 40, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P004', quantity: 45, reorder_level: 20, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P005', quantity: 95, reorder_level: 30, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P006', quantity: 60, reorder_level: 25, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P007', quantity: 35, reorder_level: 15, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P008', quantity: 200, reorder_level: 50, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P009', quantity: 110, reorder_level: 40, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P010', quantity: 300, reorder_level: 100, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P011', quantity: 85, reorder_level: 25, last_updated: '2024-03-22' },
    { branch_id: 'B001', product_id: 'P012', quantity: 75, reorder_level: 30, last_updated: '2024-03-22' },
    
    // Downtown Branch
    { branch_id: 'B002', product_id: 'P001', quantity: 120, reorder_level: 50, last_updated: '2024-03-22' },
    { branch_id: 'B002', product_id: 'P002', quantity: 65, reorder_level: 30, last_updated: '2024-03-22' },
    { branch_id: 'B002', product_id: 'P003', quantity: 100, reorder_level: 40, last_updated: '2024-03-22' },
    { branch_id: 'B002', product_id: 'P004', quantity: 35, reorder_level: 20, last_updated: '2024-03-22' },
    { branch_id: 'B002', product_id: 'P005', quantity: 70, reorder_level: 30, last_updated: '2024-03-22' },
    
    // Westside Branch
    { branch_id: 'B003', product_id: 'P001', quantity: 95, reorder_level: 50, last_updated: '2024-03-22' },
    { branch_id: 'B003', product_id: 'P002', quantity: 55, reorder_level: 30, last_updated: '2024-03-22' },
    { branch_id: 'B003', product_id: 'P003', quantity: 88, reorder_level: 40, last_updated: '2024-03-22' },
    
    // Market District Branch
    { branch_id: 'B004', product_id: 'P001', quantity: 130, reorder_level: 50, last_updated: '2024-03-22' },
    { branch_id: 'B004', product_id: 'P002', quantity: 72, reorder_level: 30, last_updated: '2024-03-22' },
    { branch_id: 'B004', product_id: 'P003', quantity: 110, reorder_level: 40, last_updated: '2024-03-22' }
];

// ========================================
// SALES DATA
// ========================================
const SALES = [
    { id: 'S001', branch_id: 'B001', date: '2024-03-22', time: '09:30', total: 1250.00, items: 25, cashier: 'Maria Santos', status: 'completed' },
    { id: 'S002', branch_id: 'B001', date: '2024-03-22', time: '10:45', total: 895.50, items: 18, cashier: 'Maria Santos', status: 'completed' },
    { id: 'S003', branch_id: 'B001', date: '2024-03-22', time: '14:20', total: 2150.00, items: 42, cashier: 'Maria Santos', status: 'completed' },
    { id: 'S004', branch_id: 'B002', date: '2024-03-22', time: '11:15', total: 1050.00, items: 20, cashier: 'Juan Dela Cruz', status: 'completed' },
    { id: 'S005', branch_id: 'B002', date: '2024-03-22', time: '15:30', total: 775.00, items: 15, cashier: 'Juan Dela Cruz', status: 'completed' },
    { id: 'S006', branch_id: 'B003', date: '2024-03-22', time: '13:00', total: 650.00, items: 12, cashier: 'Carmen Lopez', status: 'completed' },
    { id: 'S007', branch_id: 'B004', date: '2024-03-22', time: '10:00', total: 1400.00, items: 28, cashier: 'Rosa Rivera', status: 'completed' }
];

// ========================================
// RESERVATIONS DATA
// ========================================
const RESERVATIONS = [
    { 
        id: 'RES001', 
        customer: 'Maria Reyes', 
        branch_id: 'B001', 
        items: [{ product_id: 'P001', quantity: 2 }, { product_id: 'P005', quantity: 3 }], 
        date: '2024-03-22', 
        time: '10:00',
        status: 'pending',
        pickup_date: '2024-03-23'
    },
    { 
        id: 'RES002', 
        customer: 'John Santos', 
        branch_id: 'B001', 
        items: [{ product_id: 'P002', quantity: 1 }, { product_id: 'P003', quantity: 2 }], 
        date: '2024-03-21', 
        time: '14:30',
        status: 'confirmed',
        pickup_date: '2024-03-23'
    },
    { 
        id: 'RES003', 
        customer: 'Rosa Fernandez', 
        branch_id: 'B002', 
        items: [{ product_id: 'P004', quantity: 1 }], 
        date: '2024-03-22', 
        time: '11:00',
        status: 'pending',
        pickup_date: '2024-03-24'
    }
];

// ========================================
// PAYMENTS DATA
// ========================================
const PAYMENTS = [
    { id: 'PAY001', transaction_id: 'S001', amount: 1250.00, method: 'cash', date: '2024-03-22', time: '09:30', branch: 'B001', status: 'verified' },
    { id: 'PAY002', transaction_id: 'S002', amount: 895.50, method: 'gcash', date: '2024-03-22', time: '10:45', branch: 'B001', status: 'verified' },
    { id: 'PAY003', transaction_id: 'S003', amount: 2150.00, method: 'cash', date: '2024-03-22', time: '14:20', branch: 'B001', status: 'verified' },
    { id: 'PAY004', transaction_id: 'S004', amount: 1050.00, method: 'gcash', date: '2024-03-22', time: '11:15', branch: 'B002', status: 'verified' },
    { id: 'PAY005', transaction_id: 'S005', amount: 775.00, method: 'cash', date: '2024-03-22', time: '15:30', branch: 'B002', status: 'verified' }
];

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get all branches
 */
function getBranches() {
    return JSON.parse(localStorage.getItem('bentahub_branches')) || BRANCHES;
}

/**
 * Get all products
 */
function getProducts() {
    return JSON.parse(localStorage.getItem('bentahub_products')) || PRODUCTS;
}

/**
 * Get inventory for a specific branch
 */
function getInventoryByBranch(branch_id) {
    const inventory = JSON.parse(localStorage.getItem('bentahub_inventory')) || INVENTORY;
    return inventory.filter(item => item.branch_id === branch_id);
}

/**
 * Get all inventory
 */
function getAllInventory() {
    return JSON.parse(localStorage.getItem('bentahub_inventory')) || INVENTORY;
}

/**
 * Get product details
 */
function getProductById(product_id) {
    const products = getProducts();
    return products.find(p => p.id === product_id);
}

/**
 * Get branch details
 */
function getBranchById(branch_id) {
    const branches = getBranches();
    return branches.find(b => b.id === branch_id);
}

/**
 * Get sales data
 */
function getSalesData(filters = {}) {
    let sales = JSON.parse(localStorage.getItem('bentahub_sales')) || SALES;
    
    if (filters.branch_id) {
        sales = sales.filter(s => s.branch_id === filters.branch_id);
    }
    if (filters.date) {
        sales = sales.filter(s => s.date === filters.date);
    }
    
    return sales;
}

/**
 * Get reservations data
 */
function getReservations(filters = {}) {
    let reservations = JSON.parse(localStorage.getItem('bentahub_reservations')) || RESERVATIONS;
    
    if (filters.status) {
        reservations = reservations.filter(r => r.status === filters.status);
    }
    if (filters.branch_id) {
        reservations = reservations.filter(r => r.branch_id === filters.branch_id);
    }
    
    return reservations;
}

/**
 * Get payments data
 */
function getPayments(filters = {}) {
    let payments = JSON.parse(localStorage.getItem('bentahub_payments')) || PAYMENTS;
    
    if (filters.status) {
        payments = payments.filter(p => p.status === filters.status);
    }
    if (filters.method) {
        payments = payments.filter(p => p.method === filters.method);
    }
    
    return payments;
}

/**
 * Calculate total sales across all branches
 */
function getTotalSales(date = null) {
    let sales = getSalesData();
    
    if (date) {
        sales = sales.filter(s => s.date === date);
    }
    
    return sales.reduce((total, sale) => total + sale.total, 0);
}

/**
 * Get today's sales
 */
function getTodaysSales() {
    const today = new Date().toISOString().split('T')[0];
    return getTotalSales(today);
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return '₱' + parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format date
 */
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
}

/**
 * Format time
 */
function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Initialize mock data on page load
document.addEventListener('DOMContentLoaded', initializeMockData);
