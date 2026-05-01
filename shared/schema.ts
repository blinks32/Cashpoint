import { pgTable, text, serial, integer, boolean, decimal, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin', 'super_admin']);
export const kycStatusEnum = pgEnum('kyc_status', ['pending', 'approved', 'rejected']);
export const accountTypeEnum = pgEnum('account_type', ['checking', 'savings', 'investment']);
export const accountStatusEnum = pgEnum('account_status', ['active', 'inactive', 'frozen']);
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'transfer', 'payment']);
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed']);

// Users table with comprehensive KYC fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  
  // KYC Personal Details
  dateOfBirth: text("date_of_birth"),
  occupation: text("occupation"),
  sex: text("sex"),
  maritalStatus: text("marital_status"),
  
  // Address Information
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  alternativePhone: text("alternative_phone"),
  
  // Identity Documents
  ssn: text("ssn"),
  idNumber: text("id_number"),
  
  // Emergency Contact
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinPhone: text("next_of_kin_phone"),
  
  // Status and timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  kycStatus: kycStatusEnum("kyc_status").default('pending'),
  role: userRoleEnum("role").default('user'),
});

// Accounts table
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  accountType: accountTypeEnum("account_type").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default('0.00'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: accountStatusEnum("status").default('active'),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id").notNull().references(() => accounts.id),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  status: transactionStatusEnum("status").default('pending'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  referenceNumber: text("reference_number").notNull().unique(),
  paymentMethod: text("payment_method"), // 'bank', 'card', 'account'
  paymentDetails: text("payment_details"), // JSON string with payment info
});

// Bank Accounts table
export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolderName: text("account_holder_name").notNull(),
  routingNumber: text("routing_number"),
  accountType: text("account_type"), // 'checking', 'savings'
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Payment Methods table (for cards)
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  stripePaymentMethodId: text("stripe_payment_method_id").notNull(),
  cardBrand: text("card_brand"), // 'visa', 'mastercard', etc.
  cardLast4: text("card_last4"),
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBankAccountSchema = createInsertSchema(bankAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertBankAccount = z.infer<typeof insertBankAccountSchema>;
export type BankAccount = typeof bankAccounts.$inferSelect;
export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;
