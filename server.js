const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 🔗 ឆែក Link Admin ឱ្យច្បាស់ ១០០%
const ADMIN_API = "https://website-view-stock.vercel.app/api";

// Proxy ទាញទិន្នន័យ (Fix: បន្ថែម Cache-Control ទាំងក្នុង Request និង Response)
app.get('/proxy/data', async (req, res) => {
    try {
        const response = await axios.get(`${ADMIN_API}/data`, {
            headers: { 'Cache-Control': 'no-cache' }
        });
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.json(response.data);
    } catch (e) {
        console.error("Proxy Error:", e.message);
        res.status(500).json({ error: "Cannot reach Admin API" });
    }
});

// Proxy ឆែកឈ្មោះ
app.get('/proxy/check-id', async (req, res) => {
    try {
        const response = await axios.get(`${ADMIN_API}/check-id?uid=${req.query.uid}&zid=${req.query.zid}`);
        res.json(response.data);
    } catch (e) { res.json({ success: false }); }
});

// Proxy បញ្ជូន Order
app.post('/proxy/orders', async (req, res) => {
    try {
        const response = await axios.post(`${ADMIN_API}/orders`, req.body);
        res.json(response.data);
    } catch (e) { res.status(500).json({ success: false }); }
});

// បើកឯកសារ HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

module.exports = app;
