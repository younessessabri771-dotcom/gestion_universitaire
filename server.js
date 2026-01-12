const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/matieres', require('./routes/matieres'));
app.use('/api/students', require('./routes/students'));
app.use('/api/grades', require('./routes/grades'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📚 API disponible sur http://localhost:${PORT}/api`);
});
