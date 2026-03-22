// STAFF DASHBOARD MODULE
document.addEventListener('DOMContentLoaded', function() {
    const session = getCurrentSession();
    if (!session || session.role !== 'staff') {
        window.location.href = '/index.html';
        return;
    }
    document.getElementById('userName').textContent = session.name || 'Staff';
    const initials = (session.name || 'S').split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    loadDashboardData();
});

function switchPage(pageName, event) {
    if (event) event.preventDefault();
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageName).classList.add('active');
    
    const titleMap = {
        'dashboard': 'Dashboard',
        'inventory': 'Inventory Update',
        'reservations': 'Manage Reservations',
        'pickup': 'Prepare for Pickup'
    };
    document.getElementById('pageTitle').textContent = titleMap[pageName] || 'Staff';

    if (pageName === 'reservations') loadReservations();
    if (pageName === 'pickup') loadPickupItems();
}

function loadDashboardData() {
    const sales = getSalesData();
    const table = document.getElementById('transactionTable');
    table.innerHTML = '';
    sales.slice(-5).forEach(s => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(s.date)}</td>
            <td><span class="badge badge-success">Sale</span></td>
            <td>Transaction ${s.id}</td>
            <td><span class="badge badge-success">Completed</span></td>
        `;
        table.appendChild(row);
    });
}

function updateInventoryQR() {
    const qrCode = document.getElementById('qrCode').value;
    const quantity = document.getElementById('qrQuantity').value;
    if (qrCode && quantity) {
        showNotification(`Updated QR ${qrCode}: +${quantity} units`, 'success');
        document.getElementById('qrCode').value = '';
        document.getElementById('qrQuantity').value = '';
    }
}

function loadReservations() {
    const reservations = getReservations({ status: 'confirmed' });
    const table = document.getElementById('reservationTable');
    table.innerHTML = '';
    reservations.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.customer}</td>
            <td>${r.items.length} items</td>
            <td>${formatDate(r.pickup_date)}</td>
            <td><span class="badge badge-success">Confirmed</span></td>
            <td><button class="btn btn-small" onclick="generateReceipt('${r.id}')"><i class="fas fa-receipt"></i></button></td>
        `;
        table.appendChild(row);
    });
}

function loadPickupItems() {
    const reservations = getReservations({ status: 'confirmed' });
    const table = document.getElementById('pickupTable');
    table.innerHTML = '';
    reservations.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.id}</td>
            <td>${r.customer}</td>
            <td>${r.items.length}</td>
            <td><span class="badge badge-warning">Ready</span></td>
            <td><button class="btn btn-small btn-success" onclick="confirmPickup('${r.id}')">Confirm</button></td>
        `;
        table.appendChild(row);
    });
}

function generateReceipt(resId) {
    showNotification(`Receipt generated for reservation ${resId}`, 'success');
}

function confirmPickup(orderId) {
    showNotification(`Pickup ${orderId} confirmed and prepared`, 'success');
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
