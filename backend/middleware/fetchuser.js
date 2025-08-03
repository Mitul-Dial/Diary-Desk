const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "MitulIsAHandsomeBoy";

const fetchuser = (req, res, next) => {
  // Get the user from the JWT token and add id to req object
  const token = req.header("auth-token");
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: "Access denied. No token provided." 
    });
  }
  
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ 
      success: false,
      error: "Invalid token." 
    });
  }
};

module.exports = fetchuser;