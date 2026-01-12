const db = require('../config/database');

class Classe {
    static async getAll() {
        const [rows] = await db.execute('SELECT * FROM classe ORDER BY nom');
        return rows;
    }

    static async create(nom) {
        const [result] = await db.execute(
            'INSERT INTO classe (nom) VALUES (?)',
            [nom]
        );
        return result.insertId;
    }

    static async delete(id) {
        const [result] = await db.execute('DELETE FROM classe WHERE id = ?', [id]);
        return result.affectedRows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM classe WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = Classe;
