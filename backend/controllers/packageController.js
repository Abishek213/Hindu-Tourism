import TourPackage from '../models/Package.js';
import PackageItinerary from '../models/PackageItinerary.js';
import { validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPackage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title,destination, description, base_price, duration_days, inclusions, exclusions } = req.body;
        
        const newTourPackage = new TourPackage({
            title,
            destination,
            description,
            base_price,
            duration_days,
            inclusions,
            exclusions,
            is_active: true,
            created_by: req.user.id
        });

        if (req.file) {
            newTourPackage.brochure_url = `/uploads/brochures/${req.file.filename}`;
        }

        await newTourPackage.save();
        
        logger.info(`Package created: ${newTourPackage._id} by user ${req.user.id}`);
        res.status(201).json(newTourPackage);
    } catch (error) {
        logger.error(`Error creating package: ${error.message}`);
        res.status(500).json({ message: 'Server error while creating package' });
    }
};

export const updatePackage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const updateData = req.body;

        const tourPackage = await TourPackage.findById(id);
        if (!tourPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        tourPackage.title = updateData.title || tourPackage.title;
        tourPackage.description = updateData.description || tourPackage.description;
        tourPackage.base_price = updateData.base_price || tourPackage.base_price;
        tourPackage.duration_days = updateData.duration_days || tourPackage.duration_days;
        tourPackage.inclusions = updateData.inclusions || tourPackage.inclusions;
        tourPackage.exclusions = updateData.exclusions || tourPackage.exclusions;
        tourPackage.is_active = updateData.is_active !== undefined ? updateData.is_active : tourPackage.is_active;


        await tourPackage.save();
        
        logger.info(`Package updated: ${id} by user ${req.user.id}`);
        res.json(tourPackage);
    } catch (error) {
        logger.error(`Error updating package: ${error.message}`);
        res.status(500).json({ message: 'Server error while updating package' });
    }
};

export const getAllPackages = async (req, res) => {
    try {
        const { is_active } = req.query;
        let query = {};

        if (is_active !== undefined) {
            query.is_active = is_active === 'true';
        }

        const packages = await TourPackage.find(query)
            .populate('itineraries')
            .sort({ title: 1 });
        res.json(packages);
    } catch (error) {
        logger.error(`Error fetching packages: ${error.message}`);
        res.status(500).json({ message: 'Server error while fetching packages' });
    }
};

export const getPackageById = async (req, res) => {
    try {
        const { id } = req.params;
        const tourPackage = await TourPackage.findById(id)
            .populate({
                path: 'itineraries',
                options: { sort: { day_number: 1 } } // Sort itineraries by day number
            });
        
        if (!tourPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        
        res.json(tourPackage);
    } catch (error) {
        logger.error(`Error fetching package: ${error.message}`);
        res.status(500).json({ message: 'Server error while fetching package' });
    }
};

export const updatePackageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        
        // Validate that is_active is provided
        if (is_active === undefined || is_active === null) {
            return res.status(400).json({ message: 'is_active field is required' });
        }
        
        const tourPackage = await TourPackage.findById(id);    
        if (!tourPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }
        
        // Use the value sent from frontend instead of toggling
        tourPackage.is_active = is_active;
        await tourPackage.save();
        
        logger.info(`Package status updated to ${tourPackage.is_active} for package ${id} by user ${req.user.id}`);
        res.json({ message: 'Package status updated', is_active: tourPackage.is_active });
    } catch (error) {
        logger.error(`Error updating package status: ${error.message}`);
        res.status(500).json({ message: 'Server error while updating package status' });
    }
};

export const addItinerary = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { packageId } = req.params;
        const { day_number, title, description, accommodation, meals, transport } = req.body;

        // Check if package exists - using tourPackage instead of package
        const tourPackage = await TourPackage.findById(packageId);
        if (!tourPackage) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Create new itinerary
        const newItinerary = new PackageItinerary({
            package_id: packageId,
            day_number,
            title,
            description,
            accommodation,
            meals,
            transport
        });

        await newItinerary.save();
        
        logger.info(`Itinerary added to package ${packageId} by user ${req.user.id}`);
        res.status(201).json(newItinerary);
    } catch (error) {
        logger.error(`Error adding itinerary: ${error.message}`);
        res.status(500).json({ message: 'Server error while adding itinerary' });
    }
};

export const updateItinerary = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { itineraryId } = req.params;
        const updateData = req.body;

        const itinerary = await PackageItinerary.findById(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        // Only update fields that were actually passed
        if (updateData.day_number !== undefined) itinerary.day_number = updateData.day_number;
        if (updateData.title !== undefined) itinerary.title = updateData.title;
        if (updateData.description !== undefined) itinerary.description = updateData.description;
        if (updateData.accommodation !== undefined) itinerary.accommodation = updateData.accommodation;
        if (updateData.meals !== undefined) itinerary.meals = updateData.meals;
        if (updateData.transport !== undefined) itinerary.transport = updateData.transport;

        await itinerary.save();
        
        logger.info(`Itinerary updated: ${itineraryId} by user ${req.user.id}`);
        res.json(itinerary);
    } catch (error) {
        logger.error(`Error updating itinerary: ${error.message}`);
        res.status(500).json({ message: 'Server error while updating itinerary' });
    }
};

export const deleteItinerary = async (req, res) => {
    try {
        const { itineraryId } = req.params;

        const itinerary = await PackageItinerary.findByIdAndDelete(itineraryId);
        if (!itinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        
        logger.info(`Itinerary deleted: ${itineraryId} by user ${req.user.id}`);
        res.json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting itinerary: ${error.message}`);
        res.status(500).json({ message: 'Server error while deleting itinerary' });
    }
};