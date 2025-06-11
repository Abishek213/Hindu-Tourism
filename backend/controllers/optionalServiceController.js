import OptionalService from '../models/OptionalService.js';
import BookingService from '../models/BookingService.js';

// Get all optional services
export const getAllServices = async (req, res) => {
  try {
    const services = await OptionalService.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch optional services',
      error: error.message
    });
  }
};

// Get active optional services only
export const getActiveServices = async (req, res) => {
  try {
    const services = await OptionalService.find({ is_active: true }).sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active services',
      error: error.message
    });
  }
};

// Get single optional service
export const getServiceById = async (req, res) => {
  try {
    const service = await OptionalService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service',
      error: error.message
    });
  }
};

// Create new optional service
export const createService = async (req, res) => {
  try {
    const { name, description, price, category, is_active } = req.body;

    // Validation
    if (!name || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    // Check if service with same name already exists
    const existingService = await OptionalService.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingService) {
      return res.status(409).json({
        success: false,
        message: 'Service with this name already exists'
      });
    }

    const newService = new OptionalService({
      name,
      description,
      price: Number(price),
      category,
      is_active: is_active !== undefined ? is_active : true
    });

    const savedService = await newService.save();
    res.status(201).json({
      success: true,
      message: 'Optional service created successfully',
      data: savedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create service',
      error: error.message
    });
  }
};

// Update optional service
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, is_active } = req.body;

    // Validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    // Check if service exists
    const service = await OptionalService.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check for duplicate name (excluding current service)
    if (name && name !== service.name) {
      const existingService = await OptionalService.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingService) {
        return res.status(409).json({
          success: false,
          message: 'Service with this name already exists'
        });
      }
    }

    const updatedService = await OptionalService.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(category && { category }),
        ...(is_active !== undefined && { is_active })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service',
      error: error.message
    });
  }
};

// Update service status only
export const updateServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({
        success: false,
        message: 'is_active field is required'
      });
    }

    const service = await OptionalService.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const updatedService = await OptionalService.findByIdAndUpdate(
      id,
      { is_active: Boolean(is_active) },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Service ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: updatedService
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update service status',
      error: error.message
    });
  }
};

// Delete optional service (soft delete by deactivating)
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await OptionalService.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if service is being used in any bookings
    const bookingServices = await BookingService.find({ service_id: id });
    if (bookingServices.length > 0) {
      // Soft delete by deactivating instead of hard delete
      await OptionalService.findByIdAndUpdate(id, { is_active: false });
      return res.status(200).json({
        success: true,
        message: 'Service deactivated as it is being used in existing bookings'
      });
    }

    // Hard delete if not used anywhere
    await OptionalService.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      error: error.message
    });
  }
};

// Get services by category
export const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const services = await OptionalService.find({ 
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      is_active: true 
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services by category',
      error: error.message
    });
  }
};

// Get service usage statistics
export const getServiceStats = async (req, res) => {
  try {
    const stats = await OptionalService.aggregate([
      {
        $lookup: {
          from: 'bookingservices',
          localField: '_id',
          foreignField: 'service_id',
          as: 'bookings'
        }
      },
      {
        $project: {
          name: 1,
          price: 1,
          is_active: 1,
          category: 1,
          totalBookings: { $size: '$bookings' },
          totalRevenue: {
            $sum: '$bookings.price_applied'
          }
        }
      },
      {
        $sort: { totalBookings: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service statistics',
      error: error.message
    });
  }
};