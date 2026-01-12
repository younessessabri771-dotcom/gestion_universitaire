const db = require('../config/database');

class Matiere {
    // Get all matieres for a specific admin
    static async getAllByAdmin(adminId) {
        const [rows] = await db.execute(
            'SELECT * FROM matiere WHERE admin_id = ? ORDER BY nom',
            [adminId]
        );
        return rows;
    }

    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM matiere ORDER BY nom');
        return rows;
    }

    // Create a new matiere for a specific admin
    static async create(nom, adminId) {
        const [result] = await db.execute(
            'INSERT INTO matiere (nom, admin_id) VALUES (?, ?)',
            [nom, adminId]
        );
        return result.insertId;
    }

    // Delete a matiere (only if it belongs to the admin)
    static async delete(id, adminId) {
        const [result] = await db.execute(
            'DELETE FROM matiere WHERE id = ? AND admin_id = ?',
            [id, adminId]
        );
        return result.affectedRows;
    }

    // Find a matiere by ID (only if it belongs to the admin)
    static async findByIdAndAdmin(id, adminId) {
        const [rows] = await db.execute(
            'SELECT * FROM matiere WHERE id = ? AND admin_id = ?',
            [id, adminId]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM matiere WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Matiere;

