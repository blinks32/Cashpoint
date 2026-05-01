// Test script to verify admin login
const fetch = require('node-fetch');

async function testAdminLogin() {
    try {
        console.log('Testing admin login...');
        
        const response = await fetch('http://localhost:5000/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@cashpoint.com',
                password: 'admin123'
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Admin login successful:', data.user);
            
            // Test admin API call
            const adminResponse = await fetch(`http://localhost:5000/api/admin/users?userId=${data.user.id}`, {
                headers: {
                    'X-User-Id': data.user.id.toString()
                }
            });
            
            if (adminResponse.ok) {
                const adminData = await adminResponse.json();
                console.log('✅ Admin API call successful, users count:', adminData.length);
            } else {
                const adminError = await adminResponse.json();
                console.log('❌ Admin API call failed:', adminResponse.status, adminError);
            }
        } else {
            console.log('❌ Admin login failed:', response.status, data);
        }
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAdminLogin();