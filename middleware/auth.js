const jwt = require('jsonwebtoken');

const authMiddleware = (requiredRole = null) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token manquant' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ error: 'Accès refusé' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token invalide' });
        }
    };
};

module.exports = authMiddleware;
