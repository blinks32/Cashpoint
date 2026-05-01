import bcrypt from "bcrypt";
import { db } from "../server/db.js";
import { users, accounts, transactions } from "../shared/schema.js";
import { eq, and, desc, sql } from "drizzle-orm";

// Database storage implementation using Neon PostgreSQL
class DatabaseStorage {
    // User operations
    async getUser(id) {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
    }

    async getUserByEmail(email) {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0];
    }

    async createUser(insertUser) {
        const result = await db.insert(users).values({
            ...insertUser,
            kycStatus: 'pending',
            role: 'user'
        }).returning();
        return result[0];
    }

    async updateUser(id, userData) {
        const result = await db.update(users)
            .set({ ...userData, updatedAt: new Date() })
            .where(eq(users.id, id))
            .returning();
        return result[0];
    }

    // Account operations
    async getAccountsByUserId(userId) {
        return await db.select().from(accounts).where(eq(accounts.userId, userId));
    }

    async getAccount(id) {
        const result = await db.select().from(accounts).where(eq(accounts.id, id));
        return result[0];
    }

    async createAccount(insertAccount) {
        const result = await db.insert(accounts).values({
            ...insertAccount,
            balance: '0.00',
            status: 'active'
        }).returning();
        return result[0];
    }

    async updateAccount(id, accountData) {
        const result = await db.update(accounts)
            .set({ ...accountData, updatedAt: new Date() })
            .where(eq(accounts.id, id))
            .returning();
        return result[0];
    }

    // Transaction operations
    async getTransactionsByAccountIds(accountIds) {
        return await db.select().from(transactions)
            .where(sql`${transactions.accountId} = ANY(${accountIds})`)
            .orderBy(desc(transactions.createdAt));
    }

    async getTransaction(id) {
        const result = await db.select().from(transactions).where(eq(transactions.id, id));
        return result[0];
    }

    async createTransaction(insertTransaction) {
        const result = await db.insert(transactions).values({
            ...insertTransaction,
            status: 'pending'
        }).returning();
        return result[0];
    }

    async updateTransaction(id, transactionData) {
        const result = await db.update(transactions)
            .set({ ...transactionData, updatedAt: new Date() })
            .where(eq(transactions.id, id))
            .returning();
        return result[0];
    }

    // Admin operations
    async getAllUsers() {
        return await db.select().from(users).orderBy(desc(users.createdAt));
    }

    async getAllAccounts() {
        return await db.select().from(accounts).orderBy(desc(accounts.createdAt));
    }

    async getAllTransactions() {
        return await db.select().from(transactions).orderBy(desc(transactions.createdAt));
    }
}

// Initialize database and create admin user
async function initializeDatabase() {
    try {
        console.log('🚀 Initializing database...');

        // Create admin user if it doesn't exist
        const adminEmail = 'admin@cashpoint.com';
        const adminPassword = 'admin123';

        let adminUser = await storage.getUserByEmail(adminEmail);
        if (!adminUser) {
            console.log('Creating admin user...');
            const hashedPassword = await bcrypt.hash(adminPassword, 12);

            adminUser = await storage.createUser({
                email: adminEmail,
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                phone: '+1234567890'
            });

            await storage.updateUser(adminUser.id, {
                role: 'admin',
                kycStatus: 'approved'
            });

            console.log('✅ Admin user created:', adminUser.email);
        }

        console.log('✅ Database initialized successfully');

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        // Fall back to in-memory storage if database fails
        console.log('⚠️ Falling back to in-memory storage');
        return null;
    }
}

// Create storage instance
const storage = new DatabaseStorage();

// Initialize on startup
initializeDatabase();

export { storage, DatabaseStorage };