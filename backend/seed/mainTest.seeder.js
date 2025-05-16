// seed/mainTest.seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

// Import seeders
import { seedRoles } from './roles.seeder.js';
import { seedStaff } from './staff.seeder.js';
import { seedOptionalServices } from './optionalService.seeder.js';

// Import models
import Customer from '../models/Customer.js';
import Package from '../models/Package.js';
import Lead from '../models/Lead.js';
import Guide from '../models/Guide.js';
import Transport from '../models/Transport.js';
import Booking from '../models/Booking.js';
import BookingService from '../models/BookingService.js';

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Sample data for other models
const customersData = [
  {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown',
    nationality: 'American',
    is_vip: true
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1987654321',
    address: '456 Oak Ave, Somewhere',
    nationality: 'Canadian',
    special_notes: 'Vegetarian'
  }
];

const packagesData = [
  {
    title: 'European Adventure',
    description: '14-day tour through Europe\'s most famous cities',
    base_price: 2999,
    duration_days: 14,
    inclusions: 'Hotels, breakfast, guided tours',
    exclusions: 'Airfare, personal expenses',
    is_active: true
  },
  {
    title: 'Asian Discovery',
    description: '21-day exploration of Southeast Asia',
    base_price: 3499,
    duration_days: 21,
    inclusions: 'Hotels, most meals, domestic flights',
    exclusions: 'International airfare, visa fees',
    is_active: true
  }
];

const guidesData = [
  {
    name: 'Michael Johnson',
    phone: '+1122334455',
    email: 'michael@travelguides.com',
    is_active: true
  },
  {
    name: 'Sarah Williams',
    phone: '+5566778899',
    email: 'sarah@travelguides.com'
  }
];

const transportsData = [
  {
    name: 'Euro Travel Bus',
    type: 'bus',
    contact_info: 'reservations@eurobus.com',
    is_active: true
  },
  {
    name: 'Asia Air Express',
    type: 'flight',
    contact_info: 'bookings@asiaair.com'
  }
];

export const seedAll = async () => {
  let connection;
  try {
    // Connect to database
    connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency', {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    logger.info('Database connected for full seeding');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await mongoose.connection.dropDatabase();
    logger.info('Cleared existing database');

    // Seed roles first
    const roles = await seedRoles();
    logger.info('Roles seeded successfully');

    // Seed staff next (depends on roles)
    const staff = await seedStaff();
    logger.info('Staff seeded successfully');

    // Seed optional services
    const optionalServices = await seedOptionalServices();
    logger.info('Optional services seeded successfully');

    // Seed customers
    const customers = await Customer.insertMany(customersData);
    logger.info(`Seeded ${customers.length} customers`);

    // Seed packages
    const packages = await Package.insertMany(packagesData);
    logger.info(`Seeded ${packages.length} packages`);

    // Seed guides
    const guides = await Guide.insertMany(guidesData);
    logger.info(`Seeded ${guides.length} guides`);

    // Seed transports
    const transports = await Transport.insertMany(transportsData);
    logger.info(`Seeded ${transports.length} transports`);

    // Seed leads (depends on staff)
    const leadsData = [
      {
        name: 'Potential Client 1',
        email: 'client1@example.com',
        phone: '+1112223333',
        source: 'website',
        status: 'contacted',
        staff_id: staff[1]._id, // Sales Agent
        notes: 'Interested in European tour'
      },
      {
        name: 'Potential Client 2',
        email: 'client2@example.com',
        phone: '+4445556666',
        source: 'referral',
        status: 'new',
        staff_id: staff[1]._id, // Sales Agent
        notes: 'VIP referral from existing customer'
      }
    ];
    const leads = await Lead.insertMany(leadsData);
    logger.info(`Seeded ${leads.length} leads`);

    // Seed bookings (depends on customers, packages, leads, guides, transports)
    const bookingsData = [
      {
        customer_id: customers[0]._id,
        package_id: packages[0]._id,
        lead_id: leads[0]._id,
        travel_start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        travel_end_date: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000), // 44 days from now (14 day trip)
        num_travelers: 2,
        status: 'confirmed',
        guide_id: guides[0]._id,
        transport_id: transports[0]._id,
        special_requirements: 'Vegetarian meals required'
      },
      {
        customer_id: customers[1]._id,
        package_id: packages[1]._id,
        travel_start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        travel_end_date: new Date(Date.now() + 81 * 24 * 60 * 60 * 1000), // 81 days from now (21 day trip)
        num_travelers: 4,
        status: 'pending',
        special_requirements: 'Need wheelchair accessible rooms'
      }
    ];
    const bookings = await Booking.insertMany(bookingsData);
    logger.info(`Seeded ${bookings.length} bookings`);

    // Seed booking services (depends on bookings and optional services)
    const bookingServicesData = [
      {
        booking_id: bookings[0]._id,
        service_id: optionalServices[0]._id, // Helicopter Transfer
        price_applied: optionalServices[0].price
      },
      {
        booking_id: bookings[0]._id,
        service_id: optionalServices[1]._id, // Hotel Upgrade
        price_applied: optionalServices[1].price
      },
      {
        booking_id: bookings[1]._id,
        service_id: optionalServices[3]._id, // Private Vehicle
        price_applied: optionalServices[3].price
      }
    ];
    const bookingServices = await BookingService.insertMany(bookingServicesData);
    logger.info(`Seeded ${bookingServices.length} booking services`);

    return {
      roles,
      staff,
      optionalServices,
      customers,
      packages,
      guides,
      transports,
      leads,
      bookings,
      bookingServices
    };

  } catch (error) {
    logger.error('Full seeding failed:', {
      message: error.message,
      stack: error.stack,
      dbConnection: connection ? 'active' : 'failed'
    });
    throw error;
  }
};

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    try {
      await seedAll();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  })();
}