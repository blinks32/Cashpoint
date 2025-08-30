// Script to create test data via API calls
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function createTestData() {
    try {
        console.log('Creating test data...');
        
        // Create admin user
        console.log('1. Creating admin user...');
        const adminSignup = await fetch(`${API_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@cashpoint.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                phone: '+1234567890'
            })
        });
        
        if (adminSignup.ok) {
            const adminData = await adminSignup.json();
            console.log('✅ Admin user created:', adminData.user.email);
            
            // Update admin role (this would need to be done directly in storage)
            console.log('Note: You need to manually set the admin role in the database/storage');
        } else {
            const error = await adminSignup.json();
            console.log('❌ Admin creation failed:', error.message);
        }
        
        // Create test users
        const testUsers = [
            { email: 'john.doe@example.com', firstName: 'John', lastName: 'Doe', phone: '+1234567891' },
            { email: 'jane.smith@example.com', firstName: 'Jane', lastName: 'Smith', phone: '+1234567892' },
            { email: 'bob.johnson@example.com', firstName: 'Bob', lastName: 'Johnson', phone: '+1234567893' },
            { email: 'alice.brown@example.com', firstName: 'Alice', lastName: 'Brown', phone: '+1234567894' }
        ];
        
        console.log('\n2. Creating test users...');
        for (const user of testUsers) {
            const response = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...user,
                    password: 'password123'
                })
            });
            
            if (response.ok) {
                const userData = await response.json();
                console.log(`✅ Created user: ${userData.user.email}`);
            } else {
                const error = await response.json();
                console.log(`❌ Failed to create ${user.email}:`, error.message);
            }
        }
        
        console.log('\n✅ Test data creation completed!');
        console.log('\nTo access admin panel:');
        console.log('1. Go to /admin-login');
        console.log('2. Login with: admin@cashpoint.com / admin123');
        console.log('3. Note: You may need to manually set the admin role in storage');
        
    } catch (error) {
        console.error('❌ Error creating test data:', error.message);
    }
}

createTestData();