const bcrypt = require('bcrypt');
const { storage } = require('../server/storage');

async function createAdminUser() {
  try {
    const adminEmail = 'admin@cashpoint.com';
    const adminPassword = 'admin123'; // Change this to a secure password
    
    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log('Admin user already exists');
      if (existingAdmin.role !== 'admin') {
        // Update existing user to admin
        await storage.updateUser(existingAdmin.id, { role: 'admin' });
        console.log('Updated existing user to admin role');
      }
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    // Create admin user
    const adminUser = await storage.createUser({
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890'
    });
    
    // Update role to admin
    await storage.updateUser(adminUser.id, { 
      role: 'admin',
      kycStatus: 'approved'
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };