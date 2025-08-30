import bcrypt from 'bcrypt';
import { storage } from '../server/storage.js';

async function populateTestData() {
  try {
    console.log('Populating test data...');
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await storage.createUser({
      email: 'admin@cashpoint.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890'
    });
    
    // Update admin role and KYC status
    await storage.updateUser(adminUser.id, { 
      role: 'admin',
      kycStatus: 'approved'
    });
    
    console.log('✅ Admin user created:', adminUser.email);
    
    // Create test users
    const testUsers = [
      { email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', phone: '+1234567891' },
      { email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', phone: '+1234567892' },
      { email: 'bob.johnson@example.com', firstName: 'Bob', lastName: 'Johnson', phone: '+1234567893' },
      { email: 'alice.brown@example.com', firstName: 'Alice', lastName: 'Brown', phone: '+1234567894' },
      { email: 'charlie.wilson@example.com', firstName: 'Charlie', lastName: 'Wilson', phone: '+1234567895' }
    ];
    
    const userPassword = await bcrypt.hash('password123', 12);
    
    for (const userData of testUsers) {
      const user = await storage.createUser({
        ...userData,
        password: userPassword
      });
      
      // Create a checking account for each user
      const accountNumber = `CHE${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const account = await storage.createAccount({
        userId: user.id,
        accountType: 'checking',
        accountNumber
      });
      
      // Add some initial balance
      await storage.updateAccount(account.id, {
        balance: (Math.random() * 10000 + 1000).toFixed(2)
      });
      
      // Create some sample transactions
      const transactions = [
        {
          accountId: account.id,
          type: 'deposit' as const,
          amount: '2500.00',
          description: 'Initial deposit',
          referenceNumber: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
        },
        {
          accountId: account.id,
          type: 'withdrawal' as const,
          amount: '150.00',
          description: 'ATM withdrawal',
          referenceNumber: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
        }
      ];
      
      for (const txnData of transactions) {
        const transaction = await storage.createTransaction(txnData);
        await storage.updateTransaction(transaction.id, { status: 'completed' });
      }
      
      console.log(`✅ Created user: ${user.email} with account ${accountNumber}`);
    }
    
    // Get final counts
    const allUsers = await storage.getAllUsers();
    const allAccounts = await storage.getAllAccounts();
    const allTransactions = await storage.getAllTransactions();
    
    console.log('\n📊 Test data summary:');
    console.log(`Users: ${allUsers.length}`);
    console.log(`Accounts: ${allAccounts.length}`);
    console.log(`Transactions: ${allTransactions.length}`);
    
    console.log('\n🔑 Admin credentials:');
    console.log('Email: admin@cashpoint.com');
    console.log('Password: admin123');
    
    console.log('\n👥 Test user credentials (all use password: password123):');
    testUsers.forEach(user => {
      console.log(`- ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Error populating test data:', error);
  }
}

export { populateTestData };