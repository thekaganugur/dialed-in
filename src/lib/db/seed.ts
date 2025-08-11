import { db } from './index';
import { users, coffeeBeans, coffeeLogs, brewMethods } from './schema';
import { eq } from 'drizzle-orm';

// Sample users
const sampleUsers = [
  {
    id: 'user_demo_1',
    email: 'demo@example.com',
    name: 'Demo User',
    passwordHash: null, // Will be set up with auth later
  },
  {
    id: 'user_coffee_enthusiast',
    email: 'coffee.lover@example.com',
    name: 'Coffee Enthusiast',
    passwordHash: null,
  },
];

// Sample coffee beans
const sampleBeans = [
  {
    userId: 'user_demo_1',
    name: 'Ethiopian Yirgacheffe',
    roaster: 'Third Wave Coffee',
    origin: 'Gedeo Zone, Ethiopia',
    roastLevel: 'light' as const,
    process: 'washed' as const,
    purchaseDate: new Date('2024-01-15'),
    price: '24.99',
    weightGrams: 340,
    rating: 5,
    notes: 'Bright acidity, floral notes, tea-like body',
  },
  {
    userId: 'user_demo_1',
    name: 'Guatemala Huehuetenango',
    roaster: 'Local Roastery',
    origin: 'Huehuetenango, Guatemala',
    roastLevel: 'medium' as const,
    process: 'honey' as const,
    purchaseDate: new Date('2024-01-20'),
    price: '22.50',
    weightGrams: 350,
    rating: 4,
    notes: 'Chocolate notes, medium body, slight sweetness',
  },
  {
    userId: 'user_coffee_enthusiast',
    name: 'Brazilian Santos',
    roaster: 'Community Coffee',
    origin: 'São Paulo, Brazil',
    roastLevel: 'dark' as const,
    process: 'natural' as const,
    purchaseDate: new Date('2024-01-10'),
    price: '18.00',
    weightGrams: 500,
    rating: 3,
    notes: 'Bold, nutty, low acidity',
  },
];

// Sample brew methods (these match the enum values)
const sampleBrewMethods = [
  {
    name: 'v60' as const,
    defaultTemp: 200,
    defaultTime: 240,
    defaultRatio: '1:16',
    grindSize: 'Medium-fine',
    notes: 'Pour-over method for clean, bright cups',
  },
  {
    name: 'espresso' as const,
    defaultTemp: 200,
    defaultTime: 30,
    defaultRatio: '1:2',
    grindSize: 'Fine',
    notes: 'Concentrated coffee with rich crema',
  },
  {
    name: 'aeropress' as const,
    defaultTemp: 185,
    defaultTime: 90,
    defaultRatio: '1:14',
    grindSize: 'Medium-fine',
    notes: 'Versatile brewing method with clean taste',
  },
  {
    name: 'french_press' as const,
    defaultTemp: 200,
    defaultTime: 240,
    defaultRatio: '1:12',
    grindSize: 'Coarse',
    notes: 'Full-body immersion brewing',
  },
];

// Sample coffee logs
const generateSampleLogs = (beanIds: string[], userIds: string[]) => [
  {
    userId: userIds[0],
    beanId: beanIds[0], // Ethiopian Yirgacheffe
    method: 'v60' as const,
    brewedAt: new Date('2024-01-16T08:30:00'),
    doseGrams: '22.0',
    yieldGrams: '350.0',
    brewTimeSeconds: 240,
    waterTempCelsius: 200,
    grindSetting: '15 clicks on Comandante',
    rating: 5,
    notes: 'Perfect extraction! Bright and floral.',
    flavorNotes: 'Lemon, bergamot, white tea',
    isPublic: true,
  },
  {
    userId: userIds[0],
    beanId: beanIds[1], // Guatemala Huehuetenango
    method: 'espresso' as const,
    brewedAt: new Date('2024-01-21T07:15:00'),
    doseGrams: '18.0',
    yieldGrams: '36.0',
    brewTimeSeconds: 28,
    waterTempCelsius: 200,
    grindSetting: '1.2 on Niche Zero',
    rating: 4,
    notes: 'Good shot, slightly fast extraction',
    flavorNotes: 'Dark chocolate, caramel',
    isPublic: false,
  },
  {
    userId: userIds[1],
    beanId: beanIds[2], // Brazilian Santos
    method: 'french_press' as const,
    brewedAt: new Date('2024-01-11T09:00:00'),
    doseGrams: '30.0',
    yieldGrams: '360.0',
    brewTimeSeconds: 240,
    waterTempCelsius: 200,
    grindSetting: 'Coarse',
    rating: 3,
    notes: 'Simple morning brew',
    flavorNotes: 'Nuts, chocolate, tobacco',
    isPublic: true,
  },
  {
    userId: userIds[0],
    beanId: beanIds[0], // Ethiopian Yirgacheffe (different brew)
    method: 'aeropress' as const,
    brewedAt: new Date('2024-01-17T14:20:00'),
    doseGrams: '15.0',
    yieldGrams: '210.0',
    brewTimeSeconds: 90,
    waterTempCelsius: 185,
    grindSetting: '12 clicks on Comandante',
    rating: 4,
    notes: 'Experimenting with AeroPress inverted method',
    flavorNotes: 'Floral, citrus, clean finish',
    isPublic: false,
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // Clear existing data (in reverse order to avoid FK constraints)
    console.log('Clearing existing data...');
    await db.delete(coffeeLogs);
    await db.delete(coffeeBeans);
    await db.delete(brewMethods);
    await db.delete(users);

    // Insert users
    console.log('Inserting users...');
    const insertedUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`✓ Inserted ${insertedUsers.length} users`);

    // Insert brew methods
    console.log('Inserting brew methods...');
    const insertedBrewMethods = await db
      .insert(brewMethods)
      .values(sampleBrewMethods)
      .returning();
    console.log(`✓ Inserted ${insertedBrewMethods.length} brew methods`);

    // Insert coffee beans
    console.log('Inserting coffee beans...');
    const insertedBeans = await db.insert(coffeeBeans).values(sampleBeans).returning();
    console.log(`✓ Inserted ${insertedBeans.length} coffee beans`);

    // Insert coffee logs
    const sampleLogs = generateSampleLogs(
      insertedBeans.map((bean) => bean.id),
      insertedUsers.map((user) => user.id),
    );
    console.log('Inserting coffee logs...');
    const insertedLogs = await db.insert(coffeeLogs).values(sampleLogs).returning();
    console.log(`✓ Inserted ${insertedLogs.length} coffee logs`);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Seeded data summary:
- Users: ${insertedUsers.length}
- Coffee beans: ${insertedBeans.length}
- Brew methods: ${insertedBrewMethods.length}
- Coffee logs: ${insertedLogs.length}

👤 Demo users:
- demo@example.com (ID: user_demo_1)
- coffee.lover@example.com (ID: user_coffee_enthusiast)
    `);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seed completed, exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}