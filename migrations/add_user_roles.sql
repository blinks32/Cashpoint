-- Add user role enum and column
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');

-- Add role column to users table
ALTER TABLE users ADD COLUMN role user_role DEFAULT 'user';

-- Create first admin user (update with your actual admin credentials)
-- You'll need to hash the password properly in your application
INSERT INTO users (
  email, 
  password, 
  first_name, 
  last_name, 
  role,
  kyc_status
) VALUES (
  'admin@cashpoint.com',
  '$2b$10$example_hashed_password_here', -- Replace with actual hashed password
  'Admin',
  'User',
  'admin',
  'approved'
) ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_kyc_status ON users(kyc_status);