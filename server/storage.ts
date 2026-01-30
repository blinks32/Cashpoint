import { users, accounts, transactions, type User, type InsertUser, type Account, type InsertAccount, type Transaction, type InsertTransaction } from "@shared/schema";

// Storage interface for banking application
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Account operations
  getAccountsByUserId(userId: number): Promise<Account[]>;
  getAccount(id: number): Promise<Account | undefined>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccount(id: number, account: Partial<Account>): Promise<Account | undefined>;
  
  // Transaction operations
  getTransactionsByAccountIds(accountIds: number[]): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllAccounts(): Promise<Account[]>;
  getAllTransactions(): Promise<Transaction[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private accounts: Map<number, Account>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentAccountId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.accounts = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentAccountId = 1;
    this.currentTransactionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now,
      kycStatus: 'pending',
      role: 'user',
      // Ensure all optional fields are properly handled
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

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Account operations
  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return Array.from(this.accounts.values()).filter(
      (account) => account.userId === userId,
    );
  }

  async getAccount(id: number): Promise<Account | undefined> {
    return this.accounts.get(id);
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.currentAccountId++;
    const now = new Date();
    const account: Account = { 
      ...insertAccount, 
      id,
      createdAt: now,
      updatedAt: now,
      balance: '0.00',
      status: 'active'
    };
    this.accounts.set(id, account);
    return account;
  }

  async updateAccount(id: number, accountData: Partial<Account>): Promise<Account | undefined> {
    const account = this.accounts.get(id);
    if (!account) return undefined;
    
    const updatedAccount = { ...account, ...accountData, updatedAt: new Date() };
    this.accounts.set(id, updatedAccount);
    return updatedAccount;
  }

  // Transaction operations
  async getTransactionsByAccountIds(accountIds: number[]): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => accountIds.includes(transaction.accountId),
    );
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id,
      createdAt: now,
      updatedAt: now,
      status: 'pending',
      paymentMethod: insertTransaction.paymentMethod || null,
      paymentDetails: insertTransaction.paymentDetails || null,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionData, updatedAt: new Date() };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getAllAccounts(): Promise<Account[]> {
    return Array.from(this.accounts.values());
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
}

export const storage = new MemStorage();
