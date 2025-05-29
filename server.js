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

// API endpoint để lưu dữ liệu tài khoản
app.post('/api/submit', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(mongoUrl);
        console.log('Đã kết nối thành công với MongoDB');

        const db = client.db('account');
        let collection;
        if (req.body.type === 'new88') {
            collection = db.collection('new88');
        } else if (req.body.type === 'j88') {
            collection = db.collection('j88');
        } else if (req.body.type === 'hi88') {
            collection = db.collection('hi88');
        } else if (req.body.type === 'f8bet') {
            collection = db.collection('f8bet');
        } else {
            throw new Error('Loại form không hợp lệ');
        }

        let doc = {
            _account: req.body._account,
            _pat: req.body._pat,
            is_locked: false,
            token_expired: false,
            created_at: new Date()
        };
        if (req.body._prt) {
            doc._prt = req.body._prt;
        }
        const result = await collection.insertOne(doc);

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

// API endpoint để lấy danh sách tài khoản
app.get('/api/accounts/:type', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db('account');
        const collection = db.collection(req.params.type);

        const accounts = await collection.find({}, {
            projection: {
                _account: 1,
                is_locked: 1,
                token_expired: 1,
                created_at: 1,
                _id: 1
            }
        }).sort({ created_at: -1 }).toArray();

        res.json(accounts);
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy dữ liệu',
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// API endpoint để lấy danh sách trạng thái tất cả bot
app.get('/api/bot-status', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db('account');
        const collection = db.collection('bot_status');

        const botStatuses = await collection.find({}).toArray();
        res.json(botStatuses);
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy danh sách trạng thái bot',
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// API endpoint để lấy trạng thái bot cụ thể
app.get('/api/bot-status/:bot_id', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db('account');
        const collection = db.collection('bot_status');

        const status = await collection.findOne({ bot_id: req.params.bot_id });
        if (!status) {
            // Tạo bản ghi mặc định nếu bot chưa tồn tại
            await collection.insertOne({
                bot_id: req.params.bot_id,
                bot_name: req.params.bot_id, // Có thể tùy chỉnh
                is_enabled: false,
                updated_at: new Date()
            });
            return res.json({ bot_id: req.params.bot_id, is_enabled: false });
        }

        res.json({ bot_id: status.bot_id, is_enabled: status.is_enabled });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi lấy trạng thái bot',
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

// API endpoint để cập nhật trạng thái bot cụ thể
app.post('/api/bot-status/:bot_id', async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(mongoUrl);
        const db = client.db('account');
        const collection = db.collection('bot_status');

        const { is_enabled, bot_name } = req.body;
        if (typeof is_enabled !== 'boolean') {
            throw new Error('is_enabled phải là boolean');
        }

        const updateData = {
            is_enabled,
            updated_at: new Date()
        };
        if (bot_name) {
            updateData.bot_name = bot_name;
        }

        const result = await collection.updateOne(
            { bot_id: req.params.bot_id },
            { $set: updateData },
            { upsert: true }
        );

        res.json({ bot_id: req.params.bot_id, is_enabled });
    } catch (error) {
        console.error('Lỗi:', error);
        res.status(500).json({
            success: false,
            message: 'Có lỗi xảy ra khi cập nhật trạng thái bot',
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
});

app.get('/bot2', (req, res) => {
    res.sendFile(__dirname + '/bot2.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log('MongoDB URL:', mongoUrl);
});