const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 🔗 ដាក់ Link Admin របស់អ្នកនៅទីនេះ (លាក់ក្នុង Server)
const ADMIN_API = "https://website-view-stock.vercel.app/api";

// ១. Proxy ទាញទិន្នន័យពេជ្រពី MongoDB (តាមរយៈ Admin)
app.get('/proxy/data', async (req, res) => {
    try {
        const response = await axios.get(`${ADMIN_API}/data`);
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ error: "មិនអាចទាញទិន្នន័យបានទេ" });
    }
});

// ២. Proxy ឆែកឈ្មោះ MLBB
app.get('/proxy/check-id', async (req, res) => {
    const { uid, zid } = req.query;
    try {
        const response = await axios.get(`${ADMIN_API}/check-id?uid=${uid}&zid=${zid}`);
        res.json(response.data);
    } catch (e) {
        res.json({ success: false });
    }
});

// ៣. Proxy បញ្ជូនការទិញ (Order) ទៅរក្សាទុកក្នុង MongoDB
app.post('/proxy/orders', async (req, res) => {
    try {
        const response = await axios.post(`${ADMIN_API}/orders`, req.body);
        res.json(response.data);
    } catch (e) {
        res.status(500).json({ success: false });
    }
});

// បម្រើឯកសារ HTML ទៅកាន់ភ្ញៀវ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
