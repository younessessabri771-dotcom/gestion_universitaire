const express = require('express');
const router = express.Router();
const Etudiant = require('../models/Etudiant');
const Grade = require('../models/Grade');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');

// Student login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        const student = await Etudiant.findByEmail(email);
        if (!student) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const isValid = await Etudiant.validatePassword(password, student.mot_de_passe);
        if (!isValid) {
            return res.status(401).json({ error: 'Identifiants invalides' });
        }

        const token = jwt.sign(
            { id: student.id, email: student.email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Connexion réussie',
            token,
            student: {
                id: student.id,
                nom_complet: student.nom_complet,
                email: student.email
            }
        });
    } catch (error) {
        console.error('Erreur student login:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get all students for the logged-in admin
router.get('/', authMiddleware('admin'), async (req, res) => {
    try {
        const students = await Etudiant.getAllByAdmin(req.user.id);
        res.json(students);
    } catch (error) {
        console.error('Erreur get students:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Create student (admin only) - verify class belongs to admin
router.post('/', authMiddleware('admin'), async (req, res) => {
    try {
        const { nom_complet, email, password, classe_id } = req.body;

        if (!nom_complet || !email || !password) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Verify that the class belongs to the admin
        if (classe_id) {
            const Classe = require('../models/Classe');
            const classe = await Classe.findByIdAndAdmin(classe_id, req.user.id);
            if (!classe) {
                return res.status(403).json({ error: 'Cette classe ne vous appartient pas' });
            }
        }

        const existingStudent = await Etudiant.findByEmail(email);
        if (existingStudent) {
            return res.status(400).json({ error: 'Cet email existe déjà' });
        }

        const id = await Etudiant.create(nom_complet, email, password, classe_id);
        res.status(201).json({
            message: 'Étudiant créé avec succès',
            id
        });
    } catch (error) {
        console.error('Erreur create student:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Update student (admin only) - verify student and class belong to admin
router.put('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nom_complet, email, classe_id } = req.body;

        if (!nom_complet || !email) {
            return res.status(400).json({ error: 'Nom et email requis' });
        }

        // Verify that the student belongs to the admin
        const belongsToAdmin = await Etudiant.belongsToAdmin(id, req.user.id);
        if (!belongsToAdmin) {
            return res.status(403).json({ error: 'Cet étudiant ne vous appartient pas' });
        }

        // Verify that the new class belongs to the admin
        if (classe_id) {
            const Classe = require('../models/Classe');
            const classe = await Classe.findByIdAndAdmin(classe_id, req.user.id);
            if (!classe) {
                return res.status(403).json({ error: 'Cette classe ne vous appartient pas' });
            }
        }

        await Etudiant.update(id, nom_complet, email, classe_id);
        res.json({ message: 'Étudiant mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur update student:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Delete student (admin only) - verify student belongs to admin
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        // Verify that the student belongs to the admin
        const belongsToAdmin = await Etudiant.belongsToAdmin(id, req.user.id);
        if (!belongsToAdmin) {
            return res.status(403).json({ error: 'Cet étudiant ne vous appartient pas' });
        }

        const affectedRows = await Etudiant.delete(id);

        if (affectedRows === 0) {
            return res.status(404).json({ error: 'Étudiant non trouvé' });
        }

        res.json({ message: 'Étudiant supprimé avec succès' });
    } catch (error) {
        console.error('Erreur delete student:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Get student's own grades (student only) - Returns grouped grades
router.get('/me/grades', authMiddleware('student'), async (req, res) => {
    try {
        const groupedGrades = await Grade.getGroupedByStudent(req.user.id);
        const student = await Etudiant.findById(req.user.id);

        res.json({
            student: {
                nom_complet: student.nom_complet,
                email: student.email,
                classe: student.classe_nom
            },
            grades: groupedGrades
        });
    } catch (error) {
        console.error('Erreur get student grades:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
