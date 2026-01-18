const express = require('express');
const axios = require('axios'); // ត្រូវដំឡើង axios ផង (npm install axios)
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));

// ដាក់ Link Admin របស់អ្នកក្នុង Node.js (ភ្ញៀវមើលមិនឃើញក្នុង Browser ទេ)
const ADMIN_URL = "https://website-view-stock.vercel.app/api";

// ១. Proxy សម្រាប់ទាញទិន្នន័យ
app.get('/proxy/data', async (req, res) => {
    try {
        const response = await axios.get(`${ADMIN_URL}/data`);
        res.json(response.data);
    } catch (e) { res.status(500).json({ error: "Server Error" }); }
});

// ២. Proxy សម្រាប់ឆែកឈ្មោះ
app.get('/proxy/check-id', async (req, res) => {
    try {
        const { uid, zid } = req.query;
        const response = await axios.get(`${ADMIN_URL}/check-id?uid=${uid}&zid=${zid}`);
        res.json(response.data);
    } catch (e) { res.status(500).json({ error: "Server Error" }); }
});

// ៣. Proxy សម្រាប់បញ្ជូន Order
app.post('/proxy/orders', async (req, res) => {
    try {
        const response = await axios.post(`${ADMIN_URL}/orders`, req.body);
        res.json(response.data);
    } catch (e) { res.status(500).json({ error: "Server Error" }); }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
