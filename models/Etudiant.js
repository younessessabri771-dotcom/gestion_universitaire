const db = require('../config/database');
const bcrypt = require('bcrypt');

class Etudiant {
    // Get all students for a specific admin (via their classes)
    static async getAllByAdmin(adminId) {
        const [rows] = await db.execute(`
            SELECT e.*, c.nom as classe_nom, c.id as classe_id
            FROM etudiant e
            LEFT JOIN etudier_dans ed ON e.id = ed.etudiant_id
            LEFT JOIN classe c ON ed.classe_id = c.id
            WHERE c.admin_id = ? OR (c.admin_id IS NULL AND ed.classe_id IS NULL)
            ORDER BY e.nom_complet
        `, [adminId]);
        return rows;
    }

    static async getAll() {
        const [rows] = await db.execute(`
            SELECT e.*, c.nom as classe_nom, c.id as classe_id
            FROM etudiant e
            LEFT JOIN etudier_dans ed ON e.id = ed.etudiant_id
            LEFT JOIN classe c ON ed.classe_id = c.id
            ORDER BY e.nom_complet
        `);
        return rows;
    }

    static async create(nom_complet, email, password, classe_id = null) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                'INSERT INTO etudiant (nom_complet, email, mot_de_passe) VALUES (?, ?, ?)',
                [nom_complet, email, hashedPassword]
            );

            const etudiantId = result.insertId;

            // Assign to class if provided
            if (classe_id) {
                await connection.execute(
                    'INSERT INTO etudier_dans (etudiant_id, classe_id) VALUES (?, ?)',
                    [etudiantId, classe_id]
                );
            }

            await connection.commit();
            return etudiantId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async update(id, nom_complet, email, classe_id = null) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            await connection.execute(
                'UPDATE etudiant SET nom_complet = ?, email = ? WHERE id = ?',
                [nom_complet, email, id]
            );

            // Update class assignment
            await connection.execute('DELETE FROM etudier_dans WHERE etudiant_id = ?', [id]);

            if (classe_id) {
                await connection.execute(
                    'INSERT INTO etudier_dans (etudiant_id, classe_id) VALUES (?, ?)',
                    [id, classe_id]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM etudiant WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM etudiant WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(`
            SELECT e.*, c.nom as classe_nom, c.id as classe_id
            FROM etudiant e
            LEFT JOIN etudier_dans ed ON e.id = ed.etudiant_id
            LEFT JOIN classe c ON ed.classe_id = c.id
            WHERE e.id = ?
        `, [id]);
        return rows[0];
    }

    // Check if a student belongs to an admin's class
    static async belongsToAdmin(studentId, adminId) {
        const [rows] = await db.execute(`
            SELECT e.id
            FROM etudiant e
            LEFT JOIN etudier_dans ed ON e.id = ed.etudiant_id
            LEFT JOIN classe c ON ed.classe_id = c.id
            WHERE e.id = ? AND c.admin_id = ?
        `, [studentId, adminId]);
        return rows.length > 0;
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Etudiant;
