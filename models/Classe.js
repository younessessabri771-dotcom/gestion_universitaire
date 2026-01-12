const db = require('../config/database');

class Classe {
    // Get all classes for a specific admin
    static async getAllByAdmin(adminId) {
        const [rows] = await db.execute(
            'SELECT * FROM classe WHERE admin_id = ? ORDER BY nom',
            [adminId]
        );
        return rows;
    }

    // Create a new class for a specific admin
    static async create(nom, adminId) {
        const [result] = await db.execute(
            'INSERT INTO classe (nom, admin_id) VALUES (?, ?)',
            [nom, adminId]
        );
        return result.insertId;
    }

    // Delete a class (only if it belongs to the admin)
    static async delete(id, adminId) {
        const [result] = await db.execute(
            'DELETE FROM classe WHERE id = ? AND admin_id = ?',
            [id, adminId]
        );
        return result.affectedRows;
    }

    // Find a class by ID (only if it belongs to the admin)
    static async findByIdAndAdmin(id, adminId) {
        const [rows] = await db.execute(
            'SELECT * FROM classe WHERE id = ? AND admin_id = ?',
            [id, adminId]
        );
        return rows[0];
    }

    // Find a class by ID (no admin check - for internal use)
    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM classe WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Classe;

