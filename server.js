const express = require('express');
const axios = require('axios');
const app = express();

// អនុញ្ញាតឱ្យទទួលទិន្នន័យ JSON ក្នុងទំហំធំ (សម្រាប់រូបភាព Receipt)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ទិន្នន័យបណ្ដោះអាសន្ន (ចំណាំ៖ វានឹង Reset រាល់ពេល Vercel សម្រាក ឬ Redeploy)
let db = {
    products: [
        { id: 1, name: "86", price: "1.10" },
        { id: 2, name: "172", price: "2.15" },
        { id: 3, name: "257", price: "3.20" },
        { id: 4, name: "706", price: "8.50" }
    ],
    orders: []
};

/**
 * 1. API សម្រាប់ Check ID Mobile Legends
 * ប្រើ API: https://api.isan.eu.org/nickname/ml
 */
app.get('/api/check-id', async (req, res) => {
    const { uid, zid } = req.query;

    if (!uid || !zid) {
        return res.status(400).json({ success: false, message: "ID and Zone are required" });
    }

    try {
        // ហៅទៅកាន់ API ដែលអ្នកបានផ្ដល់ឱ្យ
        const url = `https://api.isan.eu.org/nickname/ml?id=${uid}&zone=${zid}`;
        const response = await axios.get(url);

        // API នេះបោះទិន្នន័យមកជា { success: true, name: "..." }
        if (response.data && response.data.success) {
            return res.json({ 
                success: true, 
                username: response.data.name 
            });
        } else {
            return res.json({ success: false, message: "រកមិនឃើញ ID ឡើយ" });
        }
    } catch (error) {
        console.error("Check ID Error:", error.message);
        return res.status(500).json({ success: false, message: "API ខាងក្រៅមានបញ្ហា" });
    }
});

/**
 * 2. API សម្រាប់ទាញទិន្នន័យ Diamond និង Orders
 */
app.get('/api/data', (req, res) => {
    res.status(200).json(db);
});

/**
 * 3. API សម្រាប់ទទួលការកុម្ម៉ង់ (Place Order)
 */
app.post('/api/orders', (req, res) => {
    try {
        const { player, id, product, price, receipt } = req.body;
        
        const newOrder = {
            orderId: Date.now(),
            player,
            id,
            product,
            price,
            receipt,
            date: new Date().toLocaleString('en-US', { timeZone: 'Asia/Phnom_Penh' })
        };

        db.orders.unshift(newOrder); // ដាក់ Order ថ្មីនៅខាងលើគេ
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "មិនអាចរក្សាទុក Order បានទេ" });
    }
});

// --- ចំណុចសំខាន់បំផុតសម្រាប់ Vercel ---
// ហាមប្រើ app.listen() ព្រោះ Vercel ប្រើ Serverless 
module.exports = app;
