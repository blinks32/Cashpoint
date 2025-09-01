#!/usr/bin/env node

import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon
neonConfig.webSocketConstructor = ws;

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('Please add DATABASE_URL to your .env file');
    process.exit(1);
  }

  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Test basic connection
    console.log('📡 Connecting to database...');
    const result = await pool.query('SELECT NOW() as current_time, version() as postgres_version');
    
    console.log('✅ Database connection successful!');
    console.log(`⏰ Current time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].postgres_version.split(' ')[0]}`);

    // Test table existence
    console.log('\n📋 Checking tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log('⚠️  No tables found. Run: npm run db:setup');
    } else {
      console.log('✅ Tables found:');
      tables.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    // Test data
    console.log('\n📊 Checking data...');
    try {
      const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
      const accountCount = await pool.query('SELECT COUNT(*) as count FROM accounts');
      const transactionCount = await pool.query('SELECT COUNT(*) as count FROM transactions');

      console.log(`   Users: ${userCount.rows[0].count}`);
      console.log(`   Accounts: ${accountCount.rows[0].count}`);
      console.log(`   Transactions: ${transactionCount.rows[0].count}`);

      // Check for admin user
      const adminUser = await pool.query('SELECT email, role FROM users WHERE role = $1', ['admin']);
      if (adminUser.rows.length > 0) {
        console.log(`✅ Admin user found: ${adminUser.rows[0].email}`);
      } else {
        console.log('⚠️  No admin user found. Run: npm run setup:admin');
      }

    } catch (error) {
      console.log('⚠️  Tables exist but may be empty or have different structure');
      console.log('   Run: npm run db:setup');
    }

    await pool.end();
    console.log('\n🎉 Database test completed successfully!');

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL format');
    console.log('2. Ensure your Neon database is running');
    console.log('3. Verify network connectivity');
    console.log('4. Check if your IP is whitelisted');
    process.exit(1);
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabaseConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { testDatabaseConnection };