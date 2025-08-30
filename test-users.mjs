// Test script to check users via API
async function testUsers() {
    try {
        console.log('Testing user endpoints...');
        
        // First, let's create a test user
        console.log('Creating test user...');
        const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
                phone: '+1234567890'
            })
        });
        
        if (signupResponse.ok) {
            const userData = await signupResponse.json();
            console.log('✅ Test user created:', userData.user);
        } else {
            const error = await signupResponse.json();
            console.log('❌ User creation failed:', signupResponse.status, error);
        }
        
        // Now try to login as admin
        console.log('\nTesting admin login...');
        const adminResponse = await fetch('http://localhost:5000/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@cashpoint.com',
                password: 'admin123'
            })
        });
        
        if (adminResponse.ok) {
            const adminData = await adminResponse.json();
            console.log('✅ Admin login successful:', adminData.user);
            
            // Test fetching users as admin
            console.log('\nFetching users as admin...');
            const usersResponse = await fetch(`http://localhost:5000/api/admin/users?userId=${adminData.user.id}`, {
                headers: {
                    'X-User-Id': adminData.user.id.toString()
                }
            });
            
            if (usersResponse.ok) {
                const users = await usersResponse.json();
                console.log('✅ Users fetched successfully:', users.length, 'users found');
                users.forEach(user => {
                    console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
                });
            } else {
                const error = await usersResponse.json();
                console.log('❌ Failed to fetch users:', usersResponse.status, error);
            }
        } else {
            const error = await adminResponse.json();
            console.log('❌ Admin login failed:', adminResponse.status, error);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testUsers();