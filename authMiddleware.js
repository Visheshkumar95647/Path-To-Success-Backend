const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        console.log("Verifying token...");
        const data = jwt.verify(token, "Vishesh@123");
        req.user = data.user;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(401).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;