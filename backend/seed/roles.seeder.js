// seed/roles.seeder.js
import Role from '../models/Role.js';

const rolesData = [
  {
    role_name: "Admin",
    manage_users_access: true,
    manage_leads_access: true,
    manage_bookings_access: true,
    manage_packages_access: true,
    manage_payments_access: true,
    generate_reports_access: true,
    assign_guides_access: true,
    update_travel_progress_access: true,
    manage_invoices_access: true,
  },
  {
    role_name: "Sales Agent",
    manage_users_access: false,
    manage_leads_access: true,
    manage_bookings_access: true,
    manage_packages_access: false,
    manage_payments_access: false,
    generate_reports_access: true,
    assign_guides_access: false,
    update_travel_progress_access: false,
    manage_invoices_access: false,
  },
  {
    role_name: "Operation Team",
    manage_users_access: false,
    manage_leads_access: false,
    manage_bookings_access: false,
    manage_packages_access: true,
    manage_payments_access: false,
    generate_reports_access: true,
    assign_guides_access: true,
    update_travel_progress_access: true,
    manage_invoices_access: false,
  },
  {
    role_name: "Accountant",
    manage_users_access: false,
    manage_leads_access: false,
    manage_bookings_access: false,
    manage_packages_access: false,
    manage_payments_access: true,
    generate_reports_access: true,
    assign_guides_access: false,
    update_travel_progress_access: false,
    manage_invoices_access: true,
  },
  {
    role_name: "Customer Portal",
    manage_users_access: false,
    manage_leads_access: false,
    manage_bookings_access: false,
    manage_packages_access: false,
    manage_payments_access: false,
    generate_reports_access: false,
    assign_guides_access: false,
    update_travel_progress_access: false,
    manage_invoices_access: false,
  }
];

export const seedRoles = async () => {
  const count = await Role.estimatedDocumentCount();
  if (count > 0) {
    console.log('Roles already exist. Skipping seed.');
    return;
  }

  const insertedRoles = await Role.insertMany(rolesData);
  console.log(`Seeded ${insertedRoles.length} roles.`);
};
