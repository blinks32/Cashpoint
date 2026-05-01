# Admin System Setup Guide

This guide will help you set up and use the admin system for your CashPoint banking application.

## Features

The admin system provides comprehensive management capabilities:

### 🎯 **Overview Dashboard**
- Total users, accounts, and balance statistics
- Pending KYC applications count
- Recent transaction monitoring
- Growth metrics and trends

### 👥 **User Management**
- View all registered users
- Approve/reject KYC applications
- Promote users to admin role
- Search and filter users
- View user details and activity

### 💳 **Account Management**
- Monitor all bank accounts
- View account balances and types
- Freeze/unfreeze accounts
- Track account creation dates
- Export account data

### 📊 **Transaction Monitoring**
- View all system transactions
- Monitor transaction statuses
- Track money flow
- Generate reports

## Setup Instructions

### 1. Database Migration
If using a real database, run the migration to add user roles:
```sql
-- Run the SQL commands in migrations/add_user_roles.sql
```

### 2. Create First Admin User
Run the setup script to create the default admin user:
```bash
npm run setup:admin
```

This creates an admin user with:
- **Email:** admin@cashpoint.com
- **Password:** admin123
- **Role:** admin

⚠️ **Important:** Change these credentials immediately after first login!

### 3. Access Admin Panel

#### Option 1: Direct Admin Login
Visit: `http://localhost:5000/admin/login`

#### Option 2: Regular Login + Admin Access
1. Login with admin credentials at `/login`
2. Navigate to `/admin` or use the "Admin Panel" link in the sidebar

## User Roles

### 👤 **User** (Default)
- Regular banking access
- Can view own accounts and transactions
- Can perform deposits, withdrawals, transfers

### 🛡️ **Admin**
- All user permissions
- Access to admin dashboard
- Can manage users and KYC
- Can freeze/unfreeze accounts
- Can view all system data

### 🔒 **Super Admin**
- All admin permissions
- Can promote users to admin role
- Highest level of system access

## Admin API Endpoints

All admin endpoints require authentication and admin role:

### User Management
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/kyc` - Update KYC status
- `PUT /api/admin/users/:id/role` - Update user role

### Account Management
- `GET /api/admin/accounts` - Get all accounts
- `PUT /api/admin/accounts/:id/status` - Update account status

### System Stats
- `GET /api/admin/stats` - Get system statistics

## Security Features

### 🔐 **Role-Based Access Control**
- Middleware checks user role on every admin request
- Routes are protected at both frontend and backend
- Automatic redirection for unauthorized access

### 🛡️ **Admin Route Protection**
- `AdminRoute` component protects frontend routes
- Backend middleware validates admin permissions
- Session-based authentication

### 🔍 **Audit Trail**
- All admin actions are logged
- User role changes are tracked
- Account status changes are recorded

## Usage Examples

### Approve KYC Application
1. Go to Admin Panel → Users
2. Find user with "pending" KYC status
3. Click the green checkmark to approve
4. User will receive approval notification

### Freeze Suspicious Account
1. Go to Admin Panel → Accounts
2. Find the account to freeze
3. Click the freeze button (red X)
4. Account will be immediately frozen

### Promote User to Admin
1. Go to Admin Panel → Users
2. Find the user to promote
3. Click the shield icon
4. User will gain admin privileges

## Troubleshooting

### Can't Access Admin Panel
- Verify user has admin or super_admin role
- Check if logged in with correct credentials
- Clear browser cache and cookies

### Admin User Not Created
- Run `npm run setup:admin` again
- Check console for error messages
- Verify database connection

### Permission Denied Errors
- Ensure user role is properly set in database
- Check if session is valid
- Verify admin middleware is working

## Best Practices

### 🔒 **Security**
- Change default admin password immediately
- Use strong passwords for admin accounts
- Regularly review admin user list
- Monitor admin activity logs

### 📊 **Monitoring**
- Check pending KYC applications daily
- Review suspicious transactions
- Monitor account creation patterns
- Track system growth metrics

### 🔄 **Maintenance**
- Regularly backup admin data
- Update admin credentials periodically
- Review and update user roles as needed
- Monitor system performance metrics

## Support

For technical support or questions about the admin system:
1. Check the console logs for error messages
2. Review the API response codes
3. Verify database connectivity
4. Contact system administrator

---

**Remember:** With great power comes great responsibility. Use admin privileges wisely and always follow your organization's security policies.