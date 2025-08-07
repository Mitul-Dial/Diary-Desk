const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = process.env.JWT_SECRET || "MitulIsAHandsomeBoy";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post("/createuser", async (req, res) => {
  let success = false;
  
  try {
    const { name, email, password } = req.body;
  
    if (!name || name.length < 3) {
      return res.status(400).json({ 
        success,
        error: "Name must be at least 3 characters long" 
      });
    }
    
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ 
        success,
        error: "Please enter a valid email" 
      });
    }
    
    if (!password || password.length < 5) {
      return res.status(400).json({ 
        success,
        error: "Password must be at least 5 characters long" 
      });
    }
    
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ 
        success,
        error: "Sorry a user with this email already exists" 
      });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);

    // Create a new user
    user = await User.create({
      name: name.trim(),
      password: secPass,
      email: email.toLowerCase().trim(),
    });

    const data = {
      user: {
        id: user.id,
      },
    };
    
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    
    
    res.json({ 
      success, 
      authtoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error: " + error.message
    });
  }
});

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post("/login", async (req, res) => {
  let success = false;
  
  try {
    const { email, password } = req.body;
    
    // Simple validation
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ 
        success,
        error: "Please enter a valid email" 
      });
    }
    
    if (!password) {
      return res.status(400).json({ 
        success,
        error: "Password is required" 
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ 
        success,
        error: "Please try to login with correct credentials" 
      });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ 
        success,
        error: "Please try to login with correct credentials" 
      });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    
    res.json({ 
      success, 
      authtoken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error: " + error.message
    });
  }
});

// ROUTE 3: Get logged in User Details using: GET "/api/auth/getuser". Login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 4: Update user profile: PUT "/api/auth/updateprofile". Login required
router.put("/updateprofile", fetchuser, async (req, res) => {
  try {
    const { name, bio, profileImage, preferences } = req.body;
    const userId = req.user.id;

    // Build user object
    const userFields = {};
    if (name && name.length >= 3) userFields.name = name;
    if (bio !== undefined) userFields.bio = bio;
    if (profileImage !== undefined) userFields.profileImage = profileImage;
    if (preferences) userFields.preferences = preferences;
    userFields.updatedAt = Date.now();

    // Update user
    let user = await User.findByIdAndUpdate(
      userId,
      { $set: userFields },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.json({ 
      success: true,
      message: "Profile updated successfully",
      user 
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 5: Change password: PUT "/api/auth/changepassword". Login required
router.put("/changepassword", fetchuser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Both current and new passwords are required" 
      });
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ 
        success: false,
        message: "New password must be at least 5 characters" 
      });
    }

    // Get user with password
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Verify current password
    const passwordCompare = await bcrypt.compare(currentPassword, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
      updatedAt: Date.now()
    });

    res.json({ 
      success: true,
      message: "Password changed successfully" 
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 6: Delete account: DELETE "/api/auth/deleteaccount". Login required
router.delete("/deleteaccount", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user's notes first
    await require("../models/Note").deleteMany({ user: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ 
      success: true,
      message: "Account deleted successfully" 
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

module.exports = router;