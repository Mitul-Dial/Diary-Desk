const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "MitulIsAHandsomeBoy";
const fetchuser = (req, res, next) => {
  const token = req.header("auth-token") || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "Access denied. No token provided." 
    });
  }
  
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    console.log('Token verified for user:', req.user.id);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ 
      success: false,
      error: "Invalid token." 
    });
  }
};

module.exports = fetchuser;