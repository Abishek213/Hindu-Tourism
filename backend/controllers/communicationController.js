import CommunicationLog from '../models/CommunicationLog.js';

export const createCommunicationLog = async (req, res) => {
  try {
    const {
      lead_id,
      customer_id,
      type,
      content,
      status
    } = req.body;
     const staff_id = req.user._id;

    // Validation (ensure required fields exist)
    if (!staff_id || !type || !content) {
      return res.status(400).json({ message: 'Staff, type, and content are required.' });
    }

    const newLog = new CommunicationLog({
      lead_id,
      customer_id,
      staff_id,
      type,
      content,
      status
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating communication log', error });
  }
};

export const getAllCommunicationLogs = async (req, res) => {
  try {
    const logs = await CommunicationLog.find()
      .populate('lead_id', 'name email') // only get name & email from lead
      .populate('customer_id', 'name contact') // only get name & contact from customer
      .populate('staff_id', 'name role') // only get name & role from staff
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communication logs', error });
  }
};

export const getLogsByLeadOrCustomer = async (req, res) => {
  try {
    const { id } = req.params; // Could be either lead_id or customer_id
    const logs = await CommunicationLog.find({
      $or: [{ lead_id: id }, { customer_id: id }]
    })
      .populate('staff_id')
      .sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error });
  }
};

export const updateCommunicationLog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLog = await CommunicationLog.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedLog) {
      return res.status(404).json({ message: 'Communication log not found' });
    }

    res.status(200).json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating log', error });
  }
};

export const deleteCommunicationLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLog = await CommunicationLog.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({ message: 'Communication log not found' });
    }

    res.status(200).json({ message: 'Communication log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting log', error });
  }
};
