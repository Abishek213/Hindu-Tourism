import OptionalService from '../models/OptionalService.js';
import logger from '../utils/logger.js';

const optionalServicesData = [
  {
    name: 'Helicopter Transfer',
    description: 'Luxury helicopter transfer from airport to destination.',
    price: 5000
  },
  {
    name: 'Hotel Upgrade',
    description: 'Upgrade to 5-star deluxe accommodation.',
    price: 1200
  },
  {
    name: 'Nurse Support',
    description: 'Personal nurse support for the duration of the trip.',
    price: 800
  },
  {
    name: 'Private Vehicle',
    description: 'Dedicated private vehicle with driver.',
    price: 1000
  },
  {
    name: 'Special Meals',
    description: 'Customized meals for dietary requirements.',
    price: 300
  }
];

export const seedOptionalServices = async () => {
  try {
    const count = await OptionalService.estimatedDocumentCount();

    if (count > 0) {
      logger.info('Optional services already exist. Skipping seed.');
      return;
    }

    const insertedServices = await OptionalService.insertMany(optionalServicesData);
    logger.info(`Seeded ${insertedServices.length} optional services: ${insertedServices.map(s => s.name).join(', ')}`);
    
    return insertedServices;
  } catch (error) {
    logger.error('Optional service seeding failed:', {
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
