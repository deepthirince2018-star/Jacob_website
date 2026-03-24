require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS (Allow Vercel + Localhost)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Test route
app.get('/', (req, res) => {
    res.send('Server + MongoDB is working!');
});

// Ping route (keeps Render awake)
app.get('/ping', (req, res) => {
    res.send('Server is awake');
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

// API Route
app.post('/api/contact', async (req, res) => {
    try {
        const { name, contactInfo, email, message } = req.body;

        if (!name || !contactInfo || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newContact = new Contact({
            name,
            contactInfo,
            email,
            message
        });

        await newContact.save();

        res.status(200).json({
            success: true,
            message: 'Message saved to database!'
        });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});