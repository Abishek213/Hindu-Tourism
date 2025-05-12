import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

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
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel_agency', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing staff entries
    await Staff.deleteMany({});

    // Fetch roles
    const roles = await Role.find({});
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.role_name] = role._id;
    });

    // Prepare hashed and role-linked staff data
    const staffData = await Promise.all(
      staffSeedData.map(async (staff) => ({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        username: staff.username,
        password_hash: await bcrypt.hash(staff.password, 10),
        is_active: true,
        role_id: roleMap[staff.role_name],
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );

    // Insert new staff
    const insertedStaff = await Staff.insertMany(staffData);
    console.log(`Staff seeding: Success (${insertedStaff.length} inserted)`);
    process.exit(0);
  } catch (error) {
    console.error(`Staff seeding: Failed (${error.message})`);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
};

// Execute directly if run as a script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedStaff();
}
