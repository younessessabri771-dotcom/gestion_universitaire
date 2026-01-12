const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const authMiddleware = require('../middleware/auth');

// Get all grades (admin only)
router.get('/', authMiddleware('admin'), async (req, res) => {
    try {
        const grades = await Grade.getAll();
        res.json(grades);
    } catch (error) {
        console.error('Erreur get grades:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Add/Update grade (admin only) - Supports both simple and control grades
router.post('/', authMiddleware('admin'), async (req, res) => {
    try {
        const { etudiant_id, matiere_id, note, type_controle, note_numerique } = req.body;

        // Validate required fields
        if (!etudiant_id || !matiere_id) {
            return res.status(400).json({ error: 'Étudiant et matière requis' });
        }

        // Check if it's simple mode or control mode
        if (type_controle && note_numerique !== undefined) {
            // Control mode
            if (!type_controle.trim()) {
                return res.status(400).json({ error: 'Type de contrôle requis' });
            }
            const id = await Grade.create(etudiant_id, matiere_id, null, type_controle, note_numerique);
            res.status(201).json({
                message: 'Note de contrôle ajoutée avec succès',
                id,
                mode: 'control'
            });
        } else if (note) {
            // Simple mode
            const id = await Grade.create(etudiant_id, matiere_id, note);
            res.status(201).json({
                message: 'Note ajoutée avec succès',
                id,
                mode: 'simple'
            });
        } else {
            return res.status(400).json({ error: 'Note ou (type_controle + note_numerique) requis' });
        }
    } catch (error) {
        console.error('Erreur create grade:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Delete grade (admin only)
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Grade.delete(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Note non trouvée' });
        }

        res.json({ message: 'Note supprimée avec succès' });
    } catch (error) {
        console.error('Erreur delete grade:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
