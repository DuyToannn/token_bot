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




function getBotNumber(botId) {
    // Kiểm tra nếu bot_id bắt đầu bằng "Cổng" hoặc có chứa số
    const portNumber = botId.match(/(?:Cổng\s*)?(\d+)/);
    return portNumber ? parseInt(portNumber[1]) : Infinity; // Trả về Infinity cho các bot không có số
}

function getBotDisplayName(botId, category) {
    if (category === 'j88') {
        // Nếu bot_id đã bắt đầu bằng "Cổng", giữ nguyên
        if (botId.startsWith('Cổng')) {
            return botId;
        }
        // Nếu bot_id chỉ là số, thêm "Cổng" vào
        const portNumber = botId.match(/^(\d+)$/);
        if (portNumber) {
            return `Cổng ${portNumber[1]}`;
        }
        // Trường hợp còn lại, giữ nguyên tên bot
        return botId;
    } else {
        // Với NEW88, luôn hiển thị dạng "Cổng X"
        const portNumber = botId.match(/\d+/);
        if (portNumber) {
            return `Cổng ${portNumber[0]}`;
        }
        return botId;
    }
}

async function fetchBotStatuses() {
    try {
        const response = await fetch(`/api/bot-status`);
        if (!response.ok) throw new Error('Không thể lấy danh sách trạng thái bot');
        const bots = await response.json();
        
        // Phân loại bot theo danh mục
        const new88Bots = bots.filter(bot => bot.category === 'new88');
        const j88Bots = bots.filter(bot => bot.category === 'j88');
        
        // Sắp xếp bot theo số cổng và tên
        new88Bots.sort((a, b) => getBotNumber(a.bot_id) - getBotNumber(b.bot_id));
        j88Bots.sort((a, b) => {
            // Đặt các bot không phải dạng "Cổng" lên trên
            const aIsPort = a.bot_id.match(/^(?:Cổng\s*)?(\d+)$/);
            const bIsPort = b.bot_id.match(/^(?:Cổng\s*)?(\d+)$/);
            
            if (!aIsPort && bIsPort) return -1;
            if (aIsPort && !bIsPort) return 1;
            if (!aIsPort && !bIsPort) return a.bot_id.localeCompare(b.bot_id);
            
            return getBotNumber(a.bot_id) - getBotNumber(b.bot_id);
        });
        
        // Cập nhật bảng NEW88
        updateBotTable('new88BotTable', new88Bots);
        
        // Cập nhật bảng J88
        updateBotTable('j88BotTable', j88Bots);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách trạng thái bot:', error);
        alert('Không thể kết nối đến server để lấy danh sách trạng thái bot');
    }
}

function updateBotTable(tableId, bots) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    bots.forEach(bot => {
        const displayName = getBotDisplayName(bot.bot_id, bot.category);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${displayName}</td>
            <td style="color: ${bot.is_enabled ? 'green' : 'red'}">${bot.is_enabled ? 'Bật' : 'Tắt'}</td>
            <td>
                <label class="toggle-switch">
                    <input type="checkbox" class="botToggle" data-bot-id="${bot.bot_id}" data-category="${bot.category}" ${bot.is_enabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Thêm sự kiện cho các công tắc
    document.querySelectorAll(`#${tableId} .botToggle`).forEach(toggle => {
        toggle.addEventListener('change', async (event) => {
            const botId = event.target.dataset.botId;
            const category = event.target.dataset.category;
            const isEnabled = event.target.checked;
            await updateBotStatus(botId, isEnabled, category);
        });
    });
}

// Hàm cập nhật trạng thái bot
async function updateBotStatus(botId, isEnabled, category) {
    try {
        const displayName = getBotDisplayName(botId, category);
        
        const response = await fetch(`/api/bot-status/${botId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                is_enabled: isEnabled, 
                bot_name: displayName,
                category: category 
            })
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





