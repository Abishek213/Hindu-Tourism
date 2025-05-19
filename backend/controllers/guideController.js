import Guide from '../models/Guide.js';

/**
 * @desc Create a new guide
 * @route POST /api/guides
 * @access Private (Sales Agent, Admin)
 */
export const createGuide = async (req, res, next) => {
  try {
    const { name, phone, email, is_active } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const guide = await Guide.create({
      name,
      phone,
      email,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ message: 'Guide created successfully', guide });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all guides
 * @route GET /api/guides
 * @access Private
 */
export const getGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update guide's active status
 * @route PUT /api/guides/:id/status
 * @access Private (Admin)
 */
export const updateGuideStatus = async (req, res, next) => {
  try {
    const { is_active } = req.body;

    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    guide.is_active = is_active;
    await guide.save();

    res.json({ message: `Guide ${is_active ? 'activated' : 'deactivated'} successfully`, guide });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Check if a guide is active
 * @route POST /api/guides/check-status
 * @access Private
 */
export const checkGuideStatus = async (req, res, next) => {
  try {
    const { guide_id } = req.body;

    if (!guide_id) {
      return res.status(400).json({ error: 'Guide ID is required' });
    }

    const guide = await Guide.findById(guide_id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    if (guide.is_active === true) {
      return res.status(200).json({ message: 'Guide is active and can be assigned.' });
    } else {
      return res.status(200).json({ message: 'Guide is inactive and cannot be assigned.' });
    }
  } catch (error) {
    next(error);
  }
};
