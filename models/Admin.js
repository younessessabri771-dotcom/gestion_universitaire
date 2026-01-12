const db = require('../config/database');
const bcrypt = require('bcrypt');

class Admin {
    static async create(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO admin (email, mot_de_passe) VALUES (?, ?)',
            [email, hashedPassword]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM admin WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = Admin;
