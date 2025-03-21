document.getElementById('accountForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        _pat: document.getElementById('_pat').value,
        _prt: document.getElementById('_prt').value,
        accountId: document.getElementById('accountId').value,
        timestamp: new Date()
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
            alert('Dữ liệu đã được lưu thành công!');
            document.getElementById('accountForm').reset();
        } else {
            alert('Có lỗi xảy ra khi lưu dữ liệu!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu!');
    }
});