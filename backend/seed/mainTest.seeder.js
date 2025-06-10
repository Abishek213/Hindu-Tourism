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
import  connectDB  from '../config/db.js';

// Import all models
import Customer from '../models/Customer.js';
import Package from '../models/Package.js';
import Lead from '../models/Lead.js';
import Guide from '../models/Guide.js';
import Transport from '../models/Transport.js';
import Booking from '../models/Booking.js';
import BookingService from '../models/BookingService.js';
import Invoice from '../models/Invoice.js';
import PackageItinerary from '../models/PackageItinerary.js';
import CommunicationLog from '../models/CommunicationLog.js';
import Payment from '../models/Payment.js';
import Document from '../models/Document.js';
import Role from '../models/Role.js';
import Staff from '../models/Staff.js';

// Configure ES modules __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Sample data configurations
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
  try {
    // Check for existing connection (replaces connectDB() call)
    // Replace the connection check with:
if (mongoose.connection.readyState !== 1) {
  await connectDB();
}
logger.info('Using database connection for seeding');

// Update the existing data check to:
const [customerCount, roleCount, staffCount] = await Promise.all([
  Customer.countDocuments(),
  Role.countDocuments(),
  Staff.countDocuments()
]);

if (customerCount > 0 || roleCount > 0 || staffCount > 0) {
  logger.info('Database already contains data. Seeding skipped.');
  return;
}

    // Core seeding sequence
    const roles = await seedRoles();
    logger.info(`Seeded ${roles.length} roles`);

    const staff = await seedStaff();
    logger.info(`Seeded ${staff.length} staff members`);

    const optionalServices = await seedOptionalServices();
    logger.info(`Seeded ${optionalServices.length} optional services`);

    const customers = await Customer.insertMany(customersData);
    logger.info(`Seeded ${customers.length} customers`);

    const packages = await Package.insertMany(packagesData);
    logger.info(`Seeded ${packages.length} packages`);

    const guides = await Guide.insertMany(guidesData);
    logger.info(`Seeded ${guides.length} guides`);

    const transports = await Transport.insertMany(transportsData);
    logger.info(`Seeded ${transports.length} transports`);

    // Leads seeding
    const leadsData = [
      {
        name: 'Potential Client 1',
        email: 'client1@example.com',
        phone: '+1112223333',
        source: 'website',
        status: 'contacted',
        staff_id: staff[1]._id,
        notes: 'Interested in European tour'
      },
      {
        name: 'Potential Client 2',
        email: 'client2@example.com',
        phone: '+4445556666',
        source: 'referral',
        status: 'new',
        staff_id: staff[1]._id,
        notes: 'VIP referral from existing customer'
      }
    ];
    const leads = await Lead.insertMany(leadsData);
    logger.info(`Seeded ${leads.length} leads`);

    // Communication logs seeding
    const communicationLogsData = [
      {
        lead_id: leads[0]._id,
        staff_id: staff[1]._id,
        type: 'call',
        content: 'Initial contact about European tour',
        status: 'completed'
      },
      {
        customer_id: customers[0]._id,
        staff_id: staff[1]._id,
        type: 'email',
        content: 'Sent booking confirmation',
        status: 'completed'
      },
      {
        lead_id: leads[1]._id,
        staff_id: staff[1]._id,
        type: 'meeting',
        content: 'VIP client consultation',
        status: 'follow_up'
      }
    ];
    const communicationLogs = await CommunicationLog.insertMany(communicationLogsData);
    logger.info(`Seeded ${communicationLogs.length} communication logs`);

    // Bookings and related data
    const bookingsData = [
      {
        customer_id: customers[0]._id,
        package_id: packages[0]._id,
        lead_id: leads[0]._id,
        travel_start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        travel_end_date: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000),
        num_travelers: 2,
        status: 'completed',
        guide_id: guides[0]._id,
        transport_id: transports[0]._id,
        special_requirements: 'Vegetarian meals'
      },
      {
        customer_id: customers[1]._id,
        package_id: packages[1]._id,
        travel_start_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        travel_end_date: new Date(Date.now() + 81 * 24 * 60 * 60 * 1000),
        num_travelers: 4,
        status: 'confirmed',
        special_requirements: 'Wheelchair access'
      }
    ];
    const bookings = await Booking.insertMany(bookingsData);
    logger.info(`Seeded ${bookings.length} bookings`);

    // Booking services
    const bookingServicesData = [
      {
        booking_id: bookings[0]._id,
        service_id: optionalServices[0]._id,
        price_applied: optionalServices[0].price
      },
      {
        booking_id: bookings[0]._id,
        service_id: optionalServices[1]._id,
        price_applied: optionalServices[1].price
      },
      {
        booking_id: bookings[1]._id,
        service_id: optionalServices[3]._id,
        price_applied: optionalServices[3].price
      }
    ];
    const bookingServices = await BookingService.insertMany(bookingServicesData);
    logger.info(`Seeded ${bookingServices.length} booking services`);

    // Invoices
    const invoicesData = [
      {
        booking_id: bookings[0]._id,
        amount: 3500,
        status: 'paid'
      },
      {
        booking_id: bookings[1]._id,
        amount: 4000,
        status: 'sent'
      }
    ];
    const invoices = await Invoice.insertMany(invoicesData);
    logger.info(`Seeded ${invoices.length} invoices`);

    // Package itineraries
    const packageItinerariesData = [
      {
        package_id: packages[0]._id,
        day_number: 1,
        title: 'Paris Arrival',
        description: 'Hotel check-in and orientation',
        accommodation: 'Hotel Paris',
        meals: 'Welcome dinner',
        transport: 'Airport transfer'
      },
      {
        package_id: packages[0]._id,
        day_number: 2,
        title: 'City Tour',
        description: 'Guided tour of major landmarks',
        accommodation: 'Hotel Paris',
        meals: 'Breakfast included'
      }
    ];
    const packageItineraries = await PackageItinerary.insertMany(packageItinerariesData);
    logger.info(`Seeded ${packageItineraries.length} itineraries`);

    // Seed payments (depends on bookings)
    const paymentsData = [
      {
        booking_id: bookings[0]._id,
        amount: 1500,
        payment_method: 'credit_card',
        status: 'completed',
        transaction_id: 'PAY-123456',
        notes: 'Deposit payment'
      },
      {
        booking_id: bookings[0]._id,
        amount: 2000,
        payment_method: 'bank_transfer',
        status: 'completed',
        transaction_id: 'PAY-789012',
        notes: 'Final payment'
      },
      {
        booking_id: bookings[1]._id,
        amount: 1000,
        payment_method: 'credit_card',
        status: 'pending',
        notes: 'Advance payment requested'
      }
    ];
    const payments = await Payment.insertMany(paymentsData);
    logger.info(`Seeded ${payments.length} payments`);

    // Seed documents (depends on customers and bookings)
    const documentsData = [
      // Main customer documents
      {
        customer_id: customers[0]._id,
        booking_id: bookings[0]._id,
        traveler_name: 'Sandesh sth',
        document_type: 'Passport',
        file_path: '/uploads/passports/sandesh.pdf',
        is_main_customer: true
      },
      // Non-main travelers (customer = null)
      {
        customer_id: null,
        booking_id: bookings[0]._id,
        traveler_name: 'Rajesh Kumar',
        document_type: 'Passport',
        file_path: '/uploads/document/rajesh.pdf',
        is_main_customer: false
      },
      {
        customer_id: null,
        booking_id: bookings[0]._id,
        traveler_name: 'Priya Sharma',
        document_type: 'Aadhaar Card', 
        file_path: '/uploads/document/priya.png',
        is_main_customer: false
      }
    ];

    const documents = await Document.insertMany(documentsData);
    logger.info(`Seeded ${documents.length} documents`);

    return {
      roles,
      staff,
      optionalServices,
      customers,
      packages,
      guides,
      transports,
      leads,
      communicationLogs,
      bookings,
      bookingServices,
      invoices,
      packageItineraries,
      payments,
      documents
    };

  } catch (error) {
    logger.error('Seeding failed:', {
      error: error.message,
      stack: error.stack,
      connectionStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
    throw error;
  }
};

// Self-execution for script mode
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  (async () => {
    try {
      await seedAll();
      logger.info('Seeding completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Seeding terminated with errors');
      process.exit(1);
    }
  })();
}