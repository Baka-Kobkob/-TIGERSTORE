const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json({ limit: '50mb' }));

// កំណត់តម្លៃ Diamonds នៅទីនេះ វានឹងមិនបាត់ឡើយ (Hard-coded)
let db = {
    products: [
        { id: 1, name: "86", price: "1.10" },
        { id: 2, name: "172", price: "2.15" },
        { id: 3, name: "257", price: "3.20" },
        { id: 4, name: "706", price: "8.50" },
        { id: 5, name: "1412", price: "16.50" },
        { id: 6, name: "2195", price: "25.00" }
    ],
    orders: []
};

app.get('/api/check-id', async (req, res) => {
    const { uid, zid } = req.query;
    try {
        const url = `https://api.isan.eu.org/nickname/ml?id=${uid}&zone=${zid}`;
        const response = await axios.get(url);
        if (response.data && response.data.success) {
            res.json({ success: true, username: response.data.name });
        } else { res.json({ success: false }); }
    } catch (e) { res.json({ success: false }); }
});

app.get('/api/data', (req, res) => res.json(db));

app.post('/api/orders', (req, res) => {
    const order = { id: Date.now(), ...req.body, date: new Date().toLocaleString() };
    db.orders.unshift(order);
    res.json({ success: true, order });
});

module.exports = app;
