import { body } from 'express-validator';

export const validatePlayerProfile = [
  body('age')
    .isInt({ min: 13, max: 50 })
    .withMessage('Age must be between 13 and 50'),
  
  body('position')
    .notEmpty()
    .isString()
    .withMessage('Position is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Position must be between 2 and 50 characters'),
  
  body('club')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Club name must be less than 100 characters'),
  
  body('nationality')
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage('Nationality must be less than 100 characters')
];