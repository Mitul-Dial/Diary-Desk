const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET || "MitulIsAHandsomeBoy";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email format").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success,
        errors: errors.array() 
      });
    }
    
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ 
          success,
          error: "Sorry a user with this email already exists" 
        });
      }
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
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
      console.error(error.message);
      res.status(500).send({
        success: false,
        error: "Internal Server Error"
      });
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    
    try {
      let user = await User.findOne({ email });
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
      console.error(error.message);
      res.status(500).send({
        success: false,
        error: "Internal Server Error"
      });
    }
  }
);

// ROUTE 3: Get logged in User Details using: GET "/api/auth/getuser". Login required
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 4: Update user profile: PUT "/api/auth/updateprofile". Login required
router.put(
  "/updateprofile",
  fetchuser,
  [
    body("name", "Name must be at least 3 characters").optional().isLength({ min: 3 }),
    body("bio", "Bio cannot exceed 500 characters").optional().isLength({ max: 500 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { name, bio, profileImage, preferences } = req.body;
      const userId = req.user.id;

      // Build user object
      const userFields = {};
      if (name) userFields.name = name;
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
      console.error(error.message);
      res.status(500).send({
        success: false,
        error: "Internal Server Error"
      });
    }
  }
);

// ROUTE 5: Change password: PUT "/api/auth/changepassword". Login required
router.put(
  "/changepassword",
  fetchuser,
  [
    body("currentPassword", "Current password is required").exists(),
    body("newPassword", "New password must be at least 5 characters").isLength({ min: 5 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

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
      console.error(error.message);
      res.status(500).send({
        success: false,
        error: "Internal Server Error"
      });
    }
  }
);

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
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

module.exports = router;