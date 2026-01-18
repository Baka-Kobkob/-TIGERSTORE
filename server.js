const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json({ limit: '50mb' }));

let db = { products: [{id:1, name:"86", price:"1.10"}], orders: [] };

app.get('/api/check-id', async (req, res) => {
    const { uid, zid } = req.query;
    try {
        const response = await axios.get(`https://api.smile.one/check-role/mlbb?user_id=${uid}&zone_id=${zid}`);
        res.json({ success: !!response.data.username, username: response.data.username });
    } catch (e) { res.json({ success: false }); }
});

app.get('/api/data', (req, res) => res.json(db));

app.post('/api/orders', (req, res) => {
    db.orders.unshift({...req.body, id: Date.now()});
    res.json({ success: true });
});

module.exports = app;
