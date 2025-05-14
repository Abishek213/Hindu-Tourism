import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import logger from '../utils/logger.js';

import Role from '../models/Role.js';
import Staff from '../models/Staff.js';

// Setup __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const staffSeedData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1000000001',
    username: 'admin',
    password: 'password123',
    role_name: 'Admin'
  },
  {
    name: 'Sales Agent',
    email: 'sales.agent@example.com',
    phone: '+1234567890',
    username: 'sales_agent',
    password: 'password123',
    role_name: 'Sales Agent'
  },
  {
    name: 'Operation Manager',
    email: 'ops.manager@example.com',
    phone: '+1234567891',
    username: 'ops_manager',
    password: 'password123',
    role_name: 'Operation Team'
  },
  {
    name: 'Finance Accountant',
    email: 'accountant@example.com',
    phone: '+1234567892',
    username: 'finance_accountant',
    password: 'password123',
    role_name: 'Accountant'
  },
  {
    name: 'Customer Support',
    email: 'support@example.com',
    phone: '+1234567893',
    username: 'customer_support',
    password: 'password123',
    role_name: 'Customer Portal'
  }
];

export const seedStaff = async () => {
  let connection;
  try {
    // Connect to database
    connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency', {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    logger.debug('Database connected for staff seeding');

    // Clear existing staff entries
    const deleteResult = await Staff.deleteMany({});
    logger.debug(`Cleared ${deleteResult.deletedCount} existing staff records`);

    // Fetch roles
    const roles = await Role.find({});
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.role_name] = role._id;
    });
    logger.debug(`Found ${roles.length} roles for staff assignment`);

    // Verify password hashing
    const testHash = await bcrypt.hash('password123', 10);
    logger.debug(`Test hash for 'password123': ${testHash}`);

    // Prepare hashed and role-linked staff data
    const staffData = await Promise.all(
      staffSeedData.map(async (staff) => {
        // Verify the password is what we expect
        if (staff.password !== 'password123') {
          logger.warn(`Unexpected password for ${staff.username}`);
        }
        
        const hashedPassword = await bcrypt.hash(staff.password, 10);
        logger.debug(`Hashed password for ${staff.username}: ${hashedPassword}`);
        
        // Verify we can compare the hash later
        const isMatch = await bcrypt.compare('password123', hashedPassword);
        if (!isMatch) {
          throw new Error(`Password hash verification failed for ${staff.username}`);
        }

        return {
          name: staff.name,
          email: staff.email,
          phone: staff.phone,
          username: staff.username,
          password_hash: hashedPassword,
          is_active: true,
          role_id: roleMap[staff.role_name],
          createdAt: new Date(),
          updatedAt: new Date()
        };
      })
    );

    // Insert new staff
    const insertedStaff = await Staff.insertMany(staffData);
    logger.info(`Staff seeding completed. Inserted ${insertedStaff.length} staff members`);
    
    return insertedStaff;
  } catch (error) {
    logger.error('Staff seeding failed:', {
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
      await seedStaff();
      process.exit(0);
    } catch (error) {
      process.exit(1);
    }
  })();
}
