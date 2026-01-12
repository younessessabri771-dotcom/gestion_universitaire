const db = require('../config/database');

class Grade {
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT et.*, e.nom_complet, e.email, m.nom as matiere_nom
            FROM etudier et
            JOIN etudiant e ON et.etudiant_id = e.id
            JOIN matiere m ON et.matiere_id = m.id
            ORDER BY e.nom_complet, m.nom, et.type_controle
        `);
        return rows;
    }

    // Get all grades for students belonging to an admin
    static async getAllByAdmin(adminId) {
        const [rows] = await db.execute(`
            SELECT et.*, e.nom_complet, e.email, m.nom as matiere_nom
            FROM etudier et
            JOIN etudiant e ON et.etudiant_id = e.id
            JOIN matiere m ON et.matiere_id = m.id
            LEFT JOIN etudier_dans ed ON e.id = ed.etudiant_id
            LEFT JOIN classe c ON ed.classe_id = c.id
            WHERE c.admin_id = ?
            ORDER BY e.nom_complet, m.nom, et.type_controle
        `, [adminId]);
        return rows;
    }

    static async getByStudent(etudiantId) {
        const [rows] = await db.execute(`
            SELECT et.*, m.nom as matiere_nom, m.id as matiere_id
            FROM etudier et
            JOIN matiere m ON et.matiere_id = m.id
            WHERE et.etudiant_id = ?
            ORDER BY m.nom, et.type_controle
        `, [etudiantId]);
        return rows;
    }

    // Create simple grade (old system)
    static async createSimple(etudiantId, matiereId, note) {
        const [result] = await db.execute(
            'INSERT INTO etudier (etudiant_id, matiere_id, note, type_controle, note_numerique) VALUES (?, ?, ?, NULL, NULL)',
            [etudiantId, matiereId, note]
        );
        return result.insertId;
    }

    // Create control grade (new system)
    static async createControl(etudiantId, matiereId, typeControle, noteNumerique) {
        const [result] = await db.execute(
            'INSERT INTO etudier (etudiant_id, matiere_id, note, type_controle, note_numerique) VALUES (?, ?, NULL, ?, ?)',
            [etudiantId, matiereId, typeControle, noteNumerique]
        );
        return result.insertId;
    }

    // Unified create method (detects which system to use)
    static async create(etudiantId, matiereId, note, typeControle = null, noteNumerique = null) {
        if (typeControle && noteNumerique !== null) {
            // New system: multiple controls
            return await this.createControl(etudiantId, matiereId, typeControle, noteNumerique);
        } else {
            // Old system: simple note
            return await this.createSimple(etudiantId, matiereId, note);
        }
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM etudier WHERE id = ?', [id]);
        return result.affectedRows;
    }

    // Get grouped grades by subject for a student
    static async getGroupedByStudent(etudiantId) {
        const grades = await this.getByStudent(etudiantId);

        // Define control order for sorting
        const controlOrder = {
            'Premier contrôle': 1,
            'Deuxième contrôle': 2,
            'Troisième contrôle': 3,
            'Quatrième contrôle': 4,
            'Activités intégrées': 5
        };

        // Group by subject
        const grouped = {};
        grades.forEach(grade => {
            if (!grouped[grade.matiere_id]) {
                grouped[grade.matiere_id] = {
                    matiere_nom: grade.matiere_nom,
                    matiere_id: grade.matiere_id,
                    simple: null,
                    controls: []
                };
            }

            if (grade.type_controle) {
                // Multiple controls mode
                grouped[grade.matiere_id].controls.push({
                    id: grade.id,
                    type: grade.type_controle,
                    note: grade.note_numerique,
                    date: grade.created_at,
                    order: controlOrder[grade.type_controle] || 99
                });
            } else {
                // Simple mode
                grouped[grade.matiere_id].simple = {
                    id: grade.id,
                    note: grade.note,
                    date: grade.created_at
                };
            }
        });

        // Sort controls in each subject by logical order
        Object.values(grouped).forEach(subject => {
            if (subject.controls.length > 0) {
                subject.controls.sort((a, b) => a.order - b.order);
            }
        });

        return Object.values(grouped);
    }
}

module.exports = Grade;
