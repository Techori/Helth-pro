import { Transaction } from "@/types/app.types";
import { v4 as uuidv4 } from 'uuid';

// Define payment method type
export type PaymentMethod = 'credit_card' | 'card' | 'upi' | 'healthcard' | 'health_card' | 'netbanking' | 'net_banking' | 'wallet' | 'loan';

// Define payment request interface
export interface PaymentRequest {
  amount: number;
  currency?: string;
  method?: string;
  description: string;
  user_id?: string;
  patientId?: string;
  hospitalId?: string;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, any>;
}

// Define payment response interface
export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  receipt?: string;
  timestamp?: string;
  status?: string;
}

// Mock payment processing
export const processPayment = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  console.log("Processing payment:", paymentData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Random success (90% success rate)
  const isSuccess = Math.random() > 0.1;
  
  if (isSuccess) {
    const transactionId = uuidv4();
    const receipt = `REC-${Math.floor(Math.random() * 1000000)}`;
    
    // Create a transaction record
    await createTransaction({
      id: transactionId,
      user_id: paymentData.user_id || paymentData.patientId || 'anonymous',
      amount: paymentData.amount,
      type: 'payment',
      description: paymentData.description,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    return {
      success: true,
      message: "Payment processed successfully",
      transactionId,
      receipt,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  } else {
    return {
      success: false,
      message: "Payment failed. Please try again or use a different payment method.",
      timestamp: new Date().toISOString(),
      status: 'failed'
    };
  }
};

// Wrapper function with improved fallback handling - Multiple signatures to support different ways of calling
export function processPaymentWithFallback(
  paymentData: PaymentRequest,
  onSuccess?: (response: PaymentResponse) => void,
  onError?: (error: any) => void
): Promise<PaymentResponse>;

export function processPaymentWithFallback(
  amount: number,
  method: PaymentMethod,
  description: string,
  userId: string,
  currency?: string
): Promise<PaymentResponse>;

// Implementation
export async function processPaymentWithFallback(
  paymentDataOrAmount: PaymentRequest | number,
  onSuccessOrMethod?: ((response: PaymentResponse) => void) | PaymentMethod,
  onErrorOrDescription?: ((error: any) => void) | string,
  userId?: string,
  currency: string = 'INR'
): Promise<PaymentResponse> {
  try {
    // Check if first argument is a number (using the second overload)
    if (typeof paymentDataOrAmount === 'number') {
      const amount = paymentDataOrAmount;
      const method = onSuccessOrMethod as PaymentMethod;
      const description = onErrorOrDescription as string;
      
      return await processPayment({
        amount,
        currency,
        method: method,
        description,
        user_id: userId
      });
    } 
    // First argument is a PaymentRequest object (using the first overload)
    else {
      const result = await processPayment(paymentDataOrAmount);
      
      if (result.success && typeof onSuccessOrMethod === 'function') {
        onSuccessOrMethod(result);
      } else if (!result.success && typeof onErrorOrDescription === 'function') {
        onErrorOrDescription(new Error(result.message));
      }
      
      return result;
    }
  } catch (error) {
    console.error("Payment processing error, using fallback:", error);
    
    // Always return success in fallback mode for demo purposes
    const transactionId = uuidv4();
    const response = {
      success: true,
      message: "[FALLBACK] Payment processed successfully",
      transactionId,
      receipt: `FALLBACK-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    if (typeof paymentDataOrAmount === 'object' && typeof onSuccessOrMethod === 'function') {
      onSuccessOrMethod(response);
    }
    
    return response;
  }
}

// Store transactions in memory
const transactions: Transaction[] = [];

// Create a transaction record
const createTransaction = async (transaction: Transaction): Promise<Transaction> => {
  transactions.push(transaction);
  return transaction;
};

// Get user transactions
export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  return transactions.filter(transaction => transaction.user_id === userId);
};

// Other existing functions to maintain
export const payEMI = async (
  loanId: string,
  amount: number,
  userId: string
): Promise<PaymentResponse> => {
  console.log(`Processing EMI payment for loan ${loanId}:`, amount);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Random success (95% success rate)
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    const transactionId = uuidv4();
    const receipt = `EMIPAY-${Math.floor(Math.random() * 1000000)}`;
    
    // Create a transaction record
    await createTransaction({
      id: transactionId,
      user_id: userId,
      amount: amount,
      type: 'payment',
      description: `EMI payment for loan ${loanId}`,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    return {
      success: true,
      message: "EMI payment successful",
      transactionId,
      receipt,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  } else {
    return {
      success: false,
      message: "EMI payment failed. Please try again or contact support.",
      timestamp: new Date().toISOString(),
      status: 'failed'
    };
  }
};

// Health card top-up
export const topUpHealthCard = async (
  cardId: string,
  amount: number,
  userId: string,
  paymentMethod: string
): Promise<PaymentResponse> => {
  console.log(`Processing health card top-up for ${cardId}:`, amount);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Random success (95% success rate)
  const isSuccess = Math.random() > 0.05;
  
  if (isSuccess) {
    const transactionId = uuidv4();
    const receipt = `HCTOPUP-${Math.floor(Math.random() * 1000000)}`;
    
    // Create a transaction record
    await createTransaction({
      id: transactionId,
      user_id: userId,
      amount: amount,
      type: 'payment',
      description: `Health card top-up for card ${cardId}`,
      status: 'completed',
      created_at: new Date().toISOString()
    });
    
    return {
      success: true,
      message: "Health card topped up successfully",
      transactionId,
      receipt,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
  } else {
    return {
      success: false,
      message: "Top-up failed. Please try again or use a different payment method.",
      timestamp: new Date().toISOString(),
      status: 'failed'
    };
  }
};
