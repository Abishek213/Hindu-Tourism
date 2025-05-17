import { body, validationResult } from 'express-validator';

export const validateInput = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Package validations
export const packageValidations = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('base_price').isFloat({ min: 0 }).withMessage('Valid base price is required'),
  body('duration_days').isInt({ min: 1 }).withMessage('Valid duration is required'),
  body('inclusions').optional().isString(),
  body('exclusions').optional().isString(),
  body('is_active').optional().isBoolean()
];

// Itinerary validations
export const itineraryValidations = [
  body('day_number').optional().isInt({ min: 1 }).withMessage('Valid day number is required'),
  body('title').optional().trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim().notEmpty().withMessage('Description is required'),
  body('accommodation').optional().isString(),
  body('meals').optional().isString(),
  body('transport').optional().isString()
];

// Export validation middleware
export const validatePackage = validateInput(packageValidations);
export const validateItinerary = validateInput(itineraryValidations);

export const leadValidations = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('phone').isMobilePhone('any').withMessage('Invalid phone number'),
  body('source')
    .optional()
    .isIn(['website', 'referral', 'social_media', 'walk_in', 'other'])
    .withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Invalid status'),
  body('notes').optional().isString()
];

// Export as validateLead for consistency with route imports
export const validateLead = validateInput(leadValidations);

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}