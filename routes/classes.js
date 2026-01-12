const express = require('express');
const router = express.Router();
const Classe = require('../models/Classe');
const authMiddleware = require('../middleware/auth');

// Get all classes (admin only)
router.get('/', authMiddleware('admin'), async (req, res) => {
    try {
        const classes = await Classe.getAll();
        res.json(classes);
    } catch (error) {
        console.error('Erreur get classes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create class (admin only)
router.post('/', authMiddleware('admin'), async (req, res) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ error: 'Nom de classe requis' });
        }

        const id = await Classe.create(nom);
        res.status(201).json({
            message: 'Classe créée avec succès',
            id,
            nom
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Cette classe existe déjà' });
        }
        console.error('Erreur create class:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Delete class (admin only)
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Classe.delete(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Classe non trouvée' });
        }

        res.json({ message: 'Classe supprimée avec succès' });
    } catch (error) {
        console.error('Erreur delete class:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
