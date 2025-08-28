import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema, insertAccountSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
      });

      // Create default checking account
      const accountNumber = `CHE${Date.now()}${Math.floor(Math.random() * 1000)}`;
      await storage.createAccount({
        userId: user.id,
        accountType: 'checking',
        accountNumber,
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Account routes
  app.get("/api/accounts/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const accounts = await storage.getAccountsByUserId(userId);
      res.json(accounts);
    } catch (error) {
      console.error("Get accounts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const accountData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      console.error("Create account error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid account data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const { accountIds } = req.query;
      if (!accountIds || typeof accountIds !== 'string') {
        return res.status(400).json({ message: "Account IDs required" });
      }
      
      const parsedAccountIds = accountIds.split(',').map(id => parseInt(id));
      const transactions = await storage.getTransactionsByAccountIds(parsedAccountIds);
      res.json(transactions);
    } catch (error) {
      console.error("Get transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const { accountId, type, amount, description } = req.body;
      
      // Generate reference number
      const referenceNumber = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;
      
      // Get account for balance check
      const account = await storage.getAccount(parseInt(accountId));
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      // Check balance for withdrawals
      if ((type === 'withdrawal' || type === 'payment') && parseFloat(account.balance || '0') < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      // Create transaction
      const transaction = await storage.createTransaction({
        accountId: parseInt(accountId),
        type,
        amount: amount.toString(),
        description,
        referenceNumber,
      });

      // Update account balance
      let newBalance: number;
      if (type === 'deposit') {
        newBalance = parseFloat(account.balance || '0') + amount;
      } else {
        newBalance = parseFloat(account.balance || '0') - amount;
      }

      await storage.updateAccount(parseInt(accountId), {
        balance: newBalance.toFixed(2),
      });

      // Mark transaction as completed
      const completedTransaction = await storage.updateTransaction(transaction.id, {
        status: 'completed',
      });

      res.status(201).json(completedTransaction);
    } catch (error) {
      console.error("Create transaction error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Transfer funds between accounts
  app.post("/api/transfers", async (req, res) => {
    try {
      const { fromAccountId, toAccountId, amount, description } = req.body;
      
      const fromAccount = await storage.getAccount(parseInt(fromAccountId));
      const toAccount = await storage.getAccount(parseInt(toAccountId));
      
      if (!fromAccount || !toAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      if (parseFloat(fromAccount.balance || '0') < amount) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const referenceNumber = `TRF${Date.now()}${Math.floor(Math.random() * 10000)}`;

      // Create withdrawal transaction
      const withdrawalTxn = await storage.createTransaction({
        accountId: parseInt(fromAccountId),
        type: 'transfer',
        amount: amount.toString(),
        description: `Transfer to ${toAccount.accountNumber}: ${description}`,
        referenceNumber: `${referenceNumber}-OUT`,
      });

      // Create deposit transaction
      const depositTxn = await storage.createTransaction({
        accountId: parseInt(toAccountId),
        type: 'transfer',
        amount: amount.toString(),
        description: `Transfer from ${fromAccount.accountNumber}: ${description}`,
        referenceNumber: `${referenceNumber}-IN`,
      });

      // Update balances
      await storage.updateAccount(parseInt(fromAccountId), {
        balance: (parseFloat(fromAccount.balance || '0') - amount).toFixed(2),
      });

      await storage.updateAccount(parseInt(toAccountId), {
        balance: (parseFloat(toAccount.balance || '0') + amount).toFixed(2),
      });

      // Mark transactions as completed
      await storage.updateTransaction(withdrawalTxn.id, { status: 'completed' });
      await storage.updateTransaction(depositTxn.id, { status: 'completed' });

      res.status(201).json({ 
        message: "Transfer completed successfully",
        withdrawalTransaction: withdrawalTxn,
        depositTransaction: depositTxn 
      });
    } catch (error) {
      console.error("Transfer error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin middleware to check if user is admin
  const requireAdmin = async (req: any, res: any, next: any) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(401).json({ message: "User ID required" });
      }
      
      const user = await storage.getUser(parseInt(userId));
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      req.adminUser = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Admin routes
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/accounts", requireAdmin, async (req, res) => {
    try {
      const accounts = await storage.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      console.error("Get all accounts error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/transactions", requireAdmin, async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Get all transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/users/:id/kyc", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: "Invalid KYC status" });
      }
      
      const updatedUser = await storage.updateUser(userId, { kycStatus: status });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update KYC status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/users/:id/role", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;
      
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      // Only super_admin can create other admins
      if (role === 'admin' && req.adminUser.role !== 'super_admin') {
        return res.status(403).json({ message: "Super admin access required" });
      }
      
      const updatedUser = await storage.updateUser(userId, { role });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/admin/accounts/:id/status", requireAdmin, async (req, res) => {
    try {
      const accountId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['active', 'inactive', 'frozen'].includes(status)) {
        return res.status(400).json({ message: "Invalid account status" });
      }
      
      const updatedAccount = await storage.updateAccount(accountId, { status });
      if (!updatedAccount) {
        return res.status(404).json({ message: "Account not found" });
      }
      
      res.json(updatedAccount);
    } catch (error) {
      console.error("Update account status error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/stats", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const accounts = await storage.getAllAccounts();
      const transactions = await storage.getAllTransactions();
      
      const stats = {
        totalUsers: users.length,
        totalAccounts: accounts.length,
        totalBalance: accounts.reduce((sum, acc) => sum + parseFloat(acc.balance || '0'), 0),
        pendingKYC: users.filter(u => u.kycStatus === 'pending').length,
        totalTransactions: transactions.length,
        recentTransactions: transactions.slice(-10)
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Send welcome email route (replaces Supabase Edge Function)
  app.post("/api/send-welcome-email", async (req, res) => {
    try {
      const { email, firstName, accountNumber } = req.body;
      
      if (!process.env.RESEND_API_KEY) {
        console.log(`Welcome email would be sent to ${email} for ${firstName} with account ${accountNumber}`);
        return res.json({ success: true, message: "Welcome email logged (no API key)" });
      }
      
      // Send email to admin
      const adminEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CashPoint <noreply@cashpoint.com>',
          to: ['admin@cashpoint.com'],
          subject: 'New User Registration - CashPoint',
          html: `
            <h2>New User Registration</h2>
            <p><strong>Name:</strong> ${firstName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Account Number:</strong> ${accountNumber}</p>
            <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
          `,
        }),
      });

      // Send welcome email to user
      const userEmailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'CashPoint <welcome@cashpoint.com>',
          to: [email],
          subject: 'Welcome to CashPoint - Your Account is Ready!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 40px; text-align: center;">
                <h1 style="color: #fbbf24; margin: 0; font-size: 32px;">Welcome to CashPoint</h1>
                <p style="color: #e5e7eb; margin: 10px 0 0 0; font-size: 18px;">Your Digital Banking Journey Starts Here</p>
              </div>
              
              <div style="padding: 40px; background: #f9fafb;">
                <h2 style="color: #1f2937; margin-bottom: 20px;">Hello ${firstName}!</h2>
                
                <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                  Congratulations! Your CashPoint account has been successfully created. You now have access to our comprehensive digital banking platform.
                </p>
                
                <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #1f2937; margin-top: 0;">Your Account Details</h3>
                  <p style="color: #4b5563; margin: 5px 0;"><strong>Account Number:</strong> ${accountNumber}</p>
                  <p style="color: #4b5563; margin: 5px 0;"><strong>Account Type:</strong> Checking Account</p>
                  <p style="color: #4b5563; margin: 5px 0;"><strong>Status:</strong> Active</p>
                </div>
                
                <h3 style="color: #1f2937;">What's Next?</h3>
                <ul style="color: #4b5563; line-height: 1.6;">
                  <li>Complete your KYC verification to unlock all features</li>
                  <li>Set up direct deposit for your salary</li>
                  <li>Explore our high-yield savings account (4.5% APY)</li>
                  <li>Download our mobile app for banking on the go</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/dashboard" 
                     style="background: #fbbf24; color: #1f2937; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Access Your Dashboard
                  </a>
                </div>
                
                <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
                  <p style="color: #92400e; margin: 0; font-size: 14px;">
                    <strong>Security Reminder:</strong> Never share your login credentials. CashPoint will never ask for your password via email or phone.
                  </p>
                </div>
              </div>
              
              <div style="background: #1f2937; padding: 20px; text-align: center;">
                <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                  Need help? Contact our 24/7 support team at support@cashpoint.com
                </p>
                <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                  © 2025 CashPoint. All rights reserved. FDIC Insured up to $250,000.
                </p>
              </div>
            </div>
          `,
        }),
      });
      
      res.json({ success: true, message: "Welcome emails sent successfully" });
    } catch (error) {
      console.error("Send welcome email error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
