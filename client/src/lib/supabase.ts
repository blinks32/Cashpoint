import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          created_at: string;
          updated_at: string;
          kyc_status: 'pending' | 'approved' | 'rejected';
          kyc_data: any;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          kyc_data?: any;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
          kyc_status?: 'pending' | 'approved' | 'rejected';
          kyc_data?: any;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          account_type: 'checking' | 'savings' | 'investment';
          account_number: string;
          balance: number;
          created_at: string;
          updated_at: string;
          status: 'active' | 'inactive' | 'frozen';
        };
        Insert: {
          id?: string;
          user_id: string;
          account_type: 'checking' | 'savings' | 'investment';
          account_number: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
          status?: 'active' | 'inactive' | 'frozen';
        };
        Update: {
          id?: string;
          user_id?: string;
          account_type?: 'checking' | 'savings' | 'investment';
          account_number?: string;
          balance?: number;
          created_at?: string;
          updated_at?: string;
          status?: 'active' | 'inactive' | 'frozen';
        };
      };
      transactions: {
        Row: {
          id: string;
          account_id: string;
          type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
          amount: number;
          description: string;
          status: 'pending' | 'completed' | 'failed';
          created_at: string;
          updated_at: string;
          reference_number: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
          amount: number;
          description: string;
          status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
          reference_number?: string;
        };
        Update: {
          id?: string;
          account_id?: string;
          type?: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
          amount?: number;
          description?: string;
          status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
          updated_at?: string;
          reference_number?: string;
        };
      };
    };
  };
};