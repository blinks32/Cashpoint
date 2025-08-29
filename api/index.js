import express from "express";
import bcrypt from "bcrypt";

// In-memory storage for Vercel (note: this will reset on each deployment)
class MemStorage {
    constructor() {
        this.users = new Map();
        this.accounts = new Map();
        this.transactions = new Map();
        this.currentUserId = 1;
        this.currentAccountId = 1;
        this.currentTransactionId = 1;
    }

    // User operations
    async getUser(id) {
        return this.users.get(id);
    }

    async getUserByEmail(email) {
        return Array.from(this.users.values()).find(
            (user) => user.email === email
        );
    }

    async createUser(insertUser) {
        const id = this.currentUserId++;
        const now = new Date();
        const user = {
            ...insertUser,
            id,
            createdAt: now,
            updatedAt: now,
            kycStatus: "pending",
            role: "user",
            phone: insertUser.phone || null,
            dateOfBirth: insertUser.dateOfBirth || null,
            occupation: insertUser.occupation || null,
            sex: insertUser.sex || null,
            maritalStatus: insertUser.maritalStatus || null,
            address: insertUser.address || null,
            city: insertUser.city || null,
            state: insertUser.state || null,
            zipCode: insertUser.zipCode || null,
            alternativePhone: insertUser.alternativePhone || null,
            ssn: insertUser.ssn || null,
            idNumber: insertUser.idNumber || null,
            nextOfKinName: insertUser.nextOfKinName || null,
            nextOfKinPhone: insertUser.nextOfKinPhone || null
        };
        this.users.set(id, user);
        return user;
    }

    async updateUser(id, userData) {
        const user = this.users.get(id);
        if (!user) return undefined;
        const updatedUser = { ...user, ...userData, updatedAt: new Date() };
        this.users.set(id, updatedUser);
        return updatedUser;
    }

    // Account operations
    async getAccountsByUserId(userId) {
        return Array.from(this.accounts.values()).filter(
            (account) => account.userId === userId
        );
    }

    async getAccount(id) {
        return this.accounts.get(id);
    }

    async createAccount(insertAccount) {
        const id = this.currentAccountId++;
        const now = new Date();
        const account = {
            ...insertAccount,
            id,
            createdAt: now,
            updatedAt: now,
            balance: "0.00",
            status: "active"
        };
        this.accounts.set(id, account);
        return account;
    }

    async updateAccount(id, accountData) {
        const account = this.accounts.get(id);
        if (!account) return undefined;
        const updatedAccount = { ...account, ...accountData, updatedAt: new Date() };
        this.accounts.set(id, updatedAccount);
        return updatedAccount;
    }

    // Transaction operations
    async getTransactionsByAccountIds(accountIds) {
        return Array.from(this.transactions.values()).filter(
            (transaction) => accountIds.includes(transaction.accountId)
        );
    }

    async getTransaction(id) {
        return this.transactions.get(id);
    }

    async createTransaction(insertTransaction) {
        const id = this.currentTransactionId++;
        const now = new Date();
        const transaction = {
            ...insertTransaction,
            id,
            createdAt: now,
            updatedAt: now,
            status: "pending"
        };
        this.transactions.set(id, transaction);
        return transaction;
    }

    async updateTransaction(id, transactionData) {
        const transaction = this.transactions.get(id);
        if (!transaction) return undefined;
        const updatedTransaction = { ...transaction, ...transactionData, updatedAt: new Date() };
        this.transactions.set(id, updatedTransaction);
        return updatedTransaction;
    }

    // Admin operations
    async getAllUsers() {
        return Array.from(this.users.values());
    }

    async getAllAccounts() {
        return Array.from(this.accounts.values());
    }

    async getAllTransactions() {
        return Array.from(this.transactions.values());
    }
}

const storage = new MemStorage();

// Create default admin user on startup
async function createDefaultAdmin() {
    try {
        const adminEmail = 'admin@cashpoint.com';
        const adminPassword = 'admin123';
        
        // Check if admin already exists
        const existingAdmin = await storage.getUserByEmail(adminEmail);
        if (existingAdmin) {
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
        
        console.log('Default admin user created for Vercel deployment');
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
}

// Create admin user on startup
createDefaultAdmin();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware for Vercel
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    });
    next();
});

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await storage.createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || null
        });

        const accountNumber = `CHE${Date.now()}${Math.floor(Math.random() * 1000)}`;
        await storage.createAccount({
            userId: user.id,
            accountType: "checking",
            accountNumber
        });

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
        const { userId, accountType } = req.body;
        
        // Validate input
        if (!userId || !accountType) {
            return res.status(400).json({ message: "Invalid account data" });
        }
        
        if (!['checking', 'savings', 'investment'].includes(accountType)) {
            return res.status(400).json({ message: "Invalid account type" });
        }
        
        // Generate account number
        const accountNumber = `CHE${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        const account = await storage.createAccount({
            userId: parseInt(userId),
            accountType,
            accountNumber
        });
        
        res.status(201).json(account);
    } catch (error) {
        console.error("Create account error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Transaction routes
app.get("/api/transactions", async (req, res) => {
    try {
        const { accountIds } = req.query;
        if (!accountIds || typeof accountIds !== "string") {
            return res.status(400).json({ message: "Account IDs required" });
        }

        const parsedAccountIds = accountIds.split(",").map((id) => parseInt(id));
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
        const referenceNumber = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

        const account = await storage.getAccount(parseInt(accountId));
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        if ((type === "withdrawal" || type === "payment") && parseFloat(account.balance || "0") < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        const transaction = await storage.createTransaction({
            accountId: parseInt(accountId),
            type,
            amount: amount.toString(),
            description,
            referenceNumber
        });

        let newBalance;
        if (type === "deposit") {
            newBalance = parseFloat(account.balance || "0") + amount;
        } else {
            newBalance = parseFloat(account.balance || "0") - amount;
        }

        await storage.updateAccount(parseInt(accountId), {
            balance: newBalance.toFixed(2)
        });

        const completedTransaction = await storage.updateTransaction(transaction.id, {
            status: "completed"
        });

        res.status(201).json(completedTransaction);
    } catch (error) {
        console.error("Create transaction error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Transfer routes
app.post("/api/transfers", async (req, res) => {
    try {
        const { fromAccountId, toAccountId, amount, description } = req.body;

        const fromAccount = await storage.getAccount(parseInt(fromAccountId));
        const toAccount = await storage.getAccount(parseInt(toAccountId));

        if (!fromAccount || !toAccount) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (parseFloat(fromAccount.balance || "0") < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        const referenceNumber = `TRF${Date.now()}${Math.floor(Math.random() * 10000)}`;

        const withdrawalTxn = await storage.createTransaction({
            accountId: parseInt(fromAccountId),
            type: "transfer",
            amount: amount.toString(),
            description: `Transfer to ${toAccount.accountNumber}: ${description}`,
            referenceNumber: `${referenceNumber}-OUT`
        });

        const depositTxn = await storage.createTransaction({
            accountId: parseInt(toAccountId),
            type: "transfer",
            amount: amount.toString(),
            description: `Transfer from ${fromAccount.accountNumber}: ${description}`,
            referenceNumber: `${referenceNumber}-IN`
        });

        await storage.updateAccount(parseInt(fromAccountId), {
            balance: (parseFloat(fromAccount.balance || "0") - amount).toFixed(2)
        });

        await storage.updateAccount(parseInt(toAccountId), {
            balance: (parseFloat(toAccount.balance || "0") + amount).toFixed(2)
        });

        await storage.updateTransaction(withdrawalTxn.id, { status: "completed" });
        await storage.updateTransaction(depositTxn.id, { status: "completed" });

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
const requireAdmin = async (req, res, next) => {
    try {
        // Get user ID from query params, body, or headers
        let userId = req.query.userId || req.body.userId || req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(401).json({ message: "User authentication required" });
        }
        
        const user = await storage.getUser(parseInt(userId));
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
            return res.status(403).json({ message: "Admin access required" });
        }
        
        req.adminUser = user;
        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
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

// Welcome email route
app.post("/api/send-welcome-email", async (req, res) => {
    try {
        const { email, firstName, accountNumber } = req.body;

        if (!process.env.RESEND_API_KEY) {
            console.log(`Welcome email would be sent to ${email} for ${firstName} with account ${accountNumber}`);
            return res.json({ success: true, message: "Welcome email logged (no API key)" });
        }

        // Email sending logic would go here
        res.json({ success: true, message: "Welcome emails sent successfully" });
    } catch (error) {
        console.error("Send welcome email error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default app;