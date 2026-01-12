const express = require('express');
const router = express.Router();
const Matiere = require('../models/Matiere');
const authMiddleware = require('../middleware/auth');

// Get all subjects (admin only)
router.get('/', authMiddleware('admin'), async (req, res) => {
    try {
        const matieres = await Matiere.getAll();
        res.json(matieres);
    } catch (error) {
        console.error('Erreur get matieres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create subject (admin only)
router.post('/', authMiddleware('admin'), async (req, res) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ error: 'Nom de matière requis' });
        }

        const id = await Matiere.create(nom);
        res.status(201).json({
            message: 'Matière créée avec succès',
            id,
            nom
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Cette matière existe déjà' });
        }
        console.error('Erreur create matiere:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Delete subject (admin only)
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Matiere.delete(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Matière non trouvée' });
        }

        res.json({ message: 'Matière supprimée avec succès' });
    } catch (error) {
        console.error('Erreur delete matiere:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
