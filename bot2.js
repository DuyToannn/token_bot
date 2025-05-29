// Handle HI88 form submission

document.getElementById('hi88Form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        _account: document.getElementById('hi88_account').value,
        _pat: document.getElementById('hi88_pat').value,
        type: 'hi88'
    };
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert('Dữ liệu HI88 đã được lưu thành công!');
            document.getElementById('hi88Form').reset();
            await fetchAndDisplayAccounts('hi88');
        } else {
            alert('Có lỗi xảy ra khi lưu dữ liệu HI88!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu HI88!');
    }
});

// Handle F8BET form submission

document.getElementById('f8betForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        _account: document.getElementById('f8bet_account').value,
        _pat: document.getElementById('f8bet_pat').value,
        type: 'f8bet'
    };
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert('Dữ liệu F8BET đã được lưu thành công!');
            document.getElementById('f8betForm').reset();
            await fetchAndDisplayAccounts('f8bet');
        } else {
            alert('Có lỗi xảy ra khi lưu dữ liệu F8BET!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu F8BET!');
    }
});

async function fetchAndDisplayAccounts(type) {
    try {
        const response = await fetch(`/api/accounts/${type}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const accounts = await response.json();
        const tbody = document.querySelector(`#${type}Table tbody`);
        tbody.innerHTML = '';
        accounts.slice(0, 5).forEach(account => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${account._account}</td>
                <td style="color: ${account.is_locked ? 'red' : 'green'}">${account.is_locked ? 'Đã Khóa' : 'Chưa khóa'}</td>
                <td style="color: ${account.token_expired ? 'red' : 'green'}">${account.token_expired ? 'Đã đăng xuất' : 'Chưa đăng xuất'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAccounts('hi88');
    fetchAndDisplayAccounts('f8bet');
}); 