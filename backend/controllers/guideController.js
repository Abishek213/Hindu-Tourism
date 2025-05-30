import Guide from '../models/Guide.js';
import Booking from '../models/Booking.js';

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

export const getGuides = async (req, res, next) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    next(error);
  }
};

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

export const assignGuide = async (req, res, next) => {
  try {
    const { guide_id } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const guide = await Guide.findById(guide_id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    if (guide.is_active === false) {
      return res.status(400).json({ error: 'Guide is inactive and cannot be assigned' });
    }

    booking.guide_id = guide_id;
    await booking.save();

    res.json({ message: 'Guide assigned successfully', booking });

  } catch (error) {
    console.error('Assign guide error:', error);
    next(error);
  }
};
