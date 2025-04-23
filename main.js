// Handle NEW88 form submission
document.getElementById('new88Form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        _account: document.getElementById('new88_account').value,
        _pat: document.getElementById('new88_pat').value,
        _prt: document.getElementById('new88_prt').value,
        type: 'new88'
    };

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Dữ liệu NEW88 đã được lưu thành công!');
            document.getElementById('new88Form').reset();
            await fetchAndDisplayAccounts('new88');
        } else {
            alert('Có lỗi xảy ra khi lưu dữ liệu NEW88!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu NEW88!');
    }
});

// Handle J88 form submission 
document.getElementById('j88Form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        _account: document.getElementById('j88_account').value,
        _pat: document.getElementById('j88_pat').value,
        _prt: document.getElementById('j88_prt').value,
        type: 'j88'
    };

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Dữ liệu J88 đã được lưu thành công!');
            document.getElementById('j88Form').reset();
            await fetchAndDisplayAccounts('j88');
        } else {
            alert('Có lỗi xảy ra khi lưu dữ liệu J88!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu J88!');
    }
});

// Handle Hi88 form submission 





async function fetchAndDisplayAccounts(type) {
    try {
        const response = await fetch(`/api/accounts/${type}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const accounts = await response.json();

        const tbody = document.querySelector(`#${type}Table tbody`);
        tbody.innerHTML = '';

        // Sort accounts to show newest first
        accounts.sort((a, b) => {
            // Assuming _id contains timestamp, newer items have larger _id
            return b._id?.localeCompare(a._id);
        });

        // Only display the 5 newest accounts
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




async function fetchBotStatuses() {
    try {
        const response = await fetch(`/api/bot-status`);
        if (!response.ok) throw new Error('Không thể lấy danh sách trạng thái bot');
        const bots = await response.json();
        // Sắp xếp các bot theo tên (bot name)
        bots.sort((a, b) => {
            // Trích xuất số từ bot_name và so sánh
            const numA = parseInt(a.bot_name.replace('bot', ''));
            const numB = parseInt(b.bot_name.replace('bot', ''));
            return numA - numB;
        });
        const tbody = document.querySelector('#botTable tbody');
        tbody.innerHTML = '';
        bots.forEach(bot => {
            // Map bot IDs to display names
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bot.bot_name}</td>
                <td style="color: ${bot.is_enabled ? 'green' : 'red'}">${bot.is_enabled ? 'Bật' : 'Tắt'}</td>
                <td>
                    <label class="toggle-switch">
                        <input type="checkbox" class="botToggle" data-bot-id="${bot.bot_id}" ${bot.is_enabled ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                </td>
            `;
            tbody.appendChild(row);
        });
        // Thêm sự kiện cho các công tắc
        document.querySelectorAll('.botToggle').forEach(toggle => {
            toggle.addEventListener('change', async (event) => {
                const botId = event.target.dataset.botId;
                const isEnabled = event.target.checked;
                await updateBotStatus(botId, isEnabled);
            });
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách trạng thái bot:', error);
        alert('Không thể kết nối đến server để lấy danh sách trạng thái bot');
    }
}

// Hàm cập nhật trạng thái bot
async function updateBotStatus(botId, isEnabled) {
    try {
        const response = await fetch(`/api/bot-status/${botId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_enabled: isEnabled, bot_name: botId })
        });
        if (!response.ok) throw new Error('Không thể cập nhật trạng thái bot');
        await fetchBotStatuses(); // Cập nhật lại bảng
    } catch (error) {
        console.error(`Lỗi khi cập nhật trạng thái bot ${botId}:`, error);
        alert(`Không thể cập nhật trạng thái bot ${botId}`);
        fetchBotStatuses(); // Làm mới bảng nếu lỗi
    }
}

// Thêm sự kiện cho công tắc chính
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAccounts('new88');
    fetchAndDisplayAccounts('j88');
    fetchBotStatuses(); // Fetch all bot statuses
});

// Cập nhật dữ liệu sau khi form được submit thành công
const updateTables = () => {
    fetchAndDisplayAccounts('new88');
    fetchAndDisplayAccounts('j88');
    fetchBotStatuses(); // Update bot statuses as well
};

// Automatically refresh bot statuses every 30 seconds
setInterval(fetchBotStatuses, 30000);





