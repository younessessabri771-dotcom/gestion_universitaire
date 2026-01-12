const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin registration
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const existingAdmin = await Admin.findByEmail(email);
        if (existingAdmin) {
            return res.status(400).json({ error: 'Cet email existe déjà' });
        }

        const adminId = await Admin.create(email, password);

        const token = jwt.sign(
            { id: adminId, email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Admin créé avec succès',
            token,
            admin: { id: adminId, email }
        });
    } catch (error) {
        console.error('Erreur registration:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const admin = await Admin.findByEmail(email);
        if (!admin) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const isValid = await Admin.validatePassword(password, admin.mot_de_passe);
        if (!isValid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            admin: { id: admin.id, email: admin.email }
        });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
