import Transport from '../models/Transport.js';
import Booking from '../models/Booking.js';

export const createTransport = async (req, res, next) => {
  try {
    const { name, type, contact_info, is_active } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const transport = await Transport.create({
      name,
      type,
      contact_info,
      is_active: is_active !== undefined ? is_active : true
    });

    res.status(201).json({ message: 'Transport created successfully', transport });
  } catch (error) {
    next(error);
  }
};

export const getTransports = async (req, res, next) => {
  try {
    const transports = await Transport.find().sort({ createdAt: -1 });
    res.json(transports);
  } catch (error) {
    next(error);
  }
};

export const updateTransportStatus = async (req, res, next) => {
  try {
    const { is_active } = req.body;

    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    transport.is_active = is_active;
    await transport.save();

    res.json({ message: `Transport ${is_active ? 'activated' : 'deactivated'} successfully`, transport });
  } catch (error) {
    next(error);
  }
};

export const checkTransportStatus = async (req, res, next) => {
  try {
    const { transport_id } = req.body;

    if (!transport_id) {
      return res.status(400).json({ error: 'Transport ID is required' });
    }

    const transport = await Transport.findById(transport_id);
    if (!transport) {
      return res.status(404).json({ error: 'Transport not found' });
    }

    if (transport.is_active === true) {
      return res.json({ message: 'Transport is active' });
    } else {
      return res.json({ message: 'Transport is inactive' });
    }

  } catch (error) {
    next(error);
  }
};

export const assignTransport = async (req, res, next) => {
  try {
    const { transport_id } = req.body;

    // Find booking by ID
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Find transport and check if active
    const transport = await Transport.findById(transport_id);
    if (!transport || !transport.is_active) {
      return res.status(400).json({ error: 'Invalid or inactive transport' });
    }

    booking.transport_id = transport_id;
    await booking.save();

    res.json({ message: 'Transport assigned successfully', booking });
  } catch (error) {
    next(error);
  }
};