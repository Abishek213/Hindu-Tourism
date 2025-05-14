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

// Common validation chains
export const authValidations = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

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