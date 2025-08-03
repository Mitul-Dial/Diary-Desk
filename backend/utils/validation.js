const { body } = require('express-validator');

const userValidation = {
  register: [
    body('name')
      .isLength({ min: 3, max: 50 })
      .withMessage('Name must be between 3 and 50 characters')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long')
  ],
  
  login: [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ]
};

const noteValidation = {
  create: [
    body('title')
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters')
      .trim(),
    body('description')
      .isLength({ min: 5, max: 10000 })
      .withMessage('Description must be between 5 and 10000 characters')
      .trim(),
    body('tag')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Tag cannot exceed 100 characters')
      .trim()
  ]
};

module.exports = {
  userValidation,
  noteValidation
};