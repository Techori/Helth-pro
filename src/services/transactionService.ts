
import { apiRequest } from "./api";

// Transaction types
export type TransactionType = 'payment' | 'refund' | 'charge';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  _id?: string;
  user: string;
  amount: number;
  type: TransactionType;
  description: string;
  status: TransactionStatus;
  hospital?: string;
  date?: string;
}

/**
 * Get all transactions for the current user
 */
export const getUserTransactions = async () => {
  try {
    console.log('Fetching user transactions');
    const transactions = await apiRequest('/transactions');
    console.log(`Retrieved ${transactions.length} transactions`);
    return transactions;
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}

/**
 * Process payment using health card
 */
export const processHealthCardPayment = async (
  userId: string,
  amount: number,
  description: string,
  hospital: string
) => {
  try {
    console.log(`Processing health card payment: ₹${amount} for ${description}`);
    
    const transaction = {
      userId,
      amount, 
      type: 'payment' as TransactionType,
      description,
      hospital
    };
    
    const result = await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
    
    console.log('Health card payment successful:', result);
    return result;
  } catch (error) {
    console.error('Health card payment failed:', error);
    throw error;
  }
}

/**
 * Process loan request
 */
export const processLoanRequest = async (
  userId: string,
  amount: number,
  purpose: string,
  tenure: number,
  hospital: string
) => {
  try {
    console.log(`Processing loan request: ₹${amount} for ${purpose}, ${tenure} months`);
    
    const transaction = {
      userId,
      amount,
      type: 'charge' as TransactionType, 
      description: `Loan for ${purpose} - ${tenure} months tenure`,
      hospital
    };
    
    const result = await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
    
    console.log('Loan request successful:', result);
    return result;
  } catch (error) {
    console.error('Loan request failed:', error);
    throw error;
  }
}

/**
 * Process refund to patient
 */
export const processRefund = async (
  userId: string,
  amount: number,
  description: string,
  hospital: string
) => {
  try {
    console.log(`Processing refund: ₹${amount} for ${description}`);
    
    const transaction = {
      userId,
      amount,
      type: 'refund' as TransactionType,
      description,
      hospital
    };
    
    const result = await apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    });
    
    console.log('Refund successful:', result);
    return result;
  } catch (error) {
    console.error('Refund failed:', error);
    throw error;
  }
}

/**
 * Get transaction by ID
 */
export const getTransactionById = async (transactionId: string) => {
  try {
    console.log(`Fetching transaction details for: ${transactionId}`);
    const transaction = await apiRequest(`/transactions/${transactionId}`);
    console.log('Transaction details retrieved:', transaction);
    return transaction;
  } catch (error) {
    console.error(`Failed to get transaction ${transactionId}:`, error);
    throw error;
  }
}
