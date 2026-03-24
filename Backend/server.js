require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection (FIXED)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Test route
app.get('/', (req, res) => {
    res.send('Server + MongoDB is working!');
});

// Schema
const ContactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contactInfo: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

// Model
const Contact = mongoose.model('Contact', ContactSchema);

// API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, contactInfo, email, message } = req.body;

        const newContact = new Contact({
            name,
            contactInfo,
            email,
            message
        });

        await newContact.save();

        res.status(200).json({ success: true, message: 'Message saved to database!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});