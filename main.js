// Handle NEW88 form submission
document.getElementById('new88Form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
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
        } else {
            alert('Có lỗi xảy ra khi lưu dữ liệu J88!');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi lưu dữ liệu J88!');
    }
});