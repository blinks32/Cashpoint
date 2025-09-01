import { db } from '../server/db.js';
import { users, accounts, transactions } from '../shared/schema.js';
import bcrypt from 'bcrypt';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');

    // Create admin user
    const adminEmail = 'admin@cashpoint.com';
    const adminPassword = 'admin123';
    
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Insert admin user (will skip if already exists)
    const adminUser = await db.insert(users).values({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      role: 'admin',
      kycStatus: 'approved'
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        role: 'admin',
        kycStatus: 'approved'
      }
    }).returning();

    console.log('✅ Admin user created/updated:', adminUser[0]?.email);

    // Check if we have any real users (non-admin)
    const allUsers = await db.select().from(users);
    const nonAdminUsers = allUsers.filter(u => u.role !== 'admin' && u.role !== 'super_admin');
    
    console.log(`📊 Database status:`);
    console.log(`   Total users: ${allUsers.length}`);
    console.log(`   Non-admin users: ${nonAdminUsers.length}`);
    console.log(`   Admin users: ${allUsers.length - nonAdminUsers.length}`);

    const allAccounts = await db.select().from(accounts);
    const allTransactions = await db.select().from(transactions);
    
    console.log(`   Total accounts: ${allAccounts.length}`);
    console.log(`   Total transactions: ${allTransactions.length}`);

    console.log('✅ Database setup complete!');
    console.log('');
    console.log('🔑 Admin credentials:');
    console.log('   Email: admin@cashpoint.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { setupDatabase };