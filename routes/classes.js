const express = require('express');
const router = express.Router();
const Classe = require('../models/Classe');
const authMiddleware = require('../middleware/auth');

// Get all classes for the logged-in admin
router.get('/', authMiddleware('admin'), async (req, res) => {
    try {
        const classes = await Classe.getAllByAdmin(req.user.id);
        res.json(classes);
    } catch (error) {
        console.error('Erreur get classes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create class for the logged-in admin
router.post('/', authMiddleware('admin'), async (req, res) => {
    try {
        const { nom } = req.body;

        if (!nom) {
            return res.status(400).json({ error: 'Nom de classe requis' });
        }

        const id = await Classe.create(nom, req.user.id);
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

// Delete class (only if it belongs to the admin)
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Classe.delete(id, req.user.id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Classe non trouvée ou accès refusé' });
        }

        res.json({ message: 'Classe supprimée avec succès' });
    } catch (error) {
        console.error('Erreur delete class:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;

