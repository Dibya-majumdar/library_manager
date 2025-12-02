const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.cookies.token;  // token stored in cookies

    if (!token) {
        return res.status(401).json({ msg: "No token, unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET123");
        req.user = decoded;   // attach user data {id, role}
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid token" });
    }
}

function adminOnly(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Admin access required" });
    }
    next();
}

module.exports = { verifyToken, adminOnly };
