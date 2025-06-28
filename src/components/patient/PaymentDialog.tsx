import React, { useState, useEffect } from 'react'; // Import useEffect
// Assuming these types are defined in your project, e.g., in a types.ts or services file
import { type HealthCard } from "@/services/healthCardService";
import { useToast } from "@/hooks/use-toast"; // Assuming you have a useToast hook
import { useAuth } from "@/hooks/useAuth"; // Assuming you have a useAuth hook

/**
 * Define the props interface for type safety.
 */
interface PaymentDialogProps {
    isOpen: boolean; // Renamed from showDialog for consistency
    onClose: () => void;
    card: HealthCard | null; // Added card prop, allowing null if it's not always present
    onPaymentSuccess: () => void; // Added callback for successful payment
}

/**
 * PaymentDialog Component
 * A modal dialog for initiating Payomatix payments for health card top-ups.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.isOpen - Controls the visibility of the dialog.
 * @param {function} props.onClose - Callback function to close the dialog.
 * @param {HealthCard | null} props.card - The health card data for which payment is being made.
 * @param {function} props.onPaymentSuccess - Callback to execute on successful payment.
 */
const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose, card, onPaymentSuccess }) => {
    // State to manage the message displayed in the dialog (e.g., success, error, info)
    const [message, setMessage] = useState<{ text: string; type: string }>({ text: '', type: '' });
    const { toast } = useToast(); // Initialize useToast hook
    const { authState } = useAuth(); // Initialize useAuth hook

    // State for form inputs (assuming you want to manage these internally)
    const [amount, setAmount] = useState<string>('');
    const [currency, setCurrency] = useState<string>('INR'); // Default to INR
    const [customerEmail, setCustomerEmail] = useState<string>(''); // You might get this from authState

    // If isOpen is false, don't render anything
    if (!isOpen) {
        return null;
    }

    /**
     * Handles the submission of the payment form.
     * Prevents default form submission, extracts data, and makes a POST request to the backend.
     * Displays appropriate messages based on the backend response or network errors.
     *
     * @param {React.FormEvent} event - The form submission event.
     */
    const handlePaymentSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form refresh

        // Clear previous messages
        setMessage({ text: '', type: '' });

        // Extract userId from authState
        const userId = authState.user?.id;
        const cardId = card?._id; // Extract cardId from the card prop
        console.log('User ID:', userId);
        console.log('Card ID:', cardId);    

        // Basic validation
        if (parseFloat(amount) <= 0 || !currency || !customerEmail || !authState.token || !cardId || !userId) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields, ensure the amount is valid, and you are logged in.",
                variant: "destructive"
            });
            setMessage({ text: 'Please fill all required fields and ensure you are logged in and have a selected card.', type: 'error' });
            return;
        }

        // Set an informational message while payment is being initiated
        setMessage({ text: 'Initiating payment... Please wait.', type: 'info' });
        toast({
            title: "Initiating Payment",
            description: "Please wait while we process your request.",
        });

        // Construct the payload for the backend request
        const payload = {
            amount: parseFloat(amount),
            currency: currency.toUpperCase(),
            customerEmail,
            cardId: cardId, // Include card ID in the payload
            userId: userId, // Include user ID in the payload
        };

        try {
            // Define the backend URL for payment intent creation
            // Ensure this URL is correct for your Payomatix integration
            const backendUrl = 'https://payomatixpaymentgateway.onrender.com/create-payment-intent';

            // Make the POST request to the backend
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState.token}` // Send authorization token
                },
                body: JSON.stringify(payload)
            });

            // Parse the JSON response from the backend
            const data = await response.json();

            // Check if the payment initiation was successful and a redirect URL is provided
            if (response.ok && data.success && data.redirectUrl) {
                setMessage({ text: 'Payment initiated successfully! Redirecting to Payomatix...', type: 'success' });
                toast({
                    title: "Payment Initiated",
                    description: "Redirecting you to the payment gateway.",
                });
                // *** IMPORTANT CHANGE HERE ***
                // DO NOT call onPaymentSuccess() here.
                // It should only be called after confirmed payment by Payomatix.
                window.location.href = data.redirectUrl;
            } else {
                // Handle backend errors or unsuccessful payment initiation
                const errorMessage = data.message || data.error || 'Unknown error during payment initiation.';
                setMessage({
                    text: `Error: ${errorMessage}. ${data.errors ? 'Details: ' + data.errors.join(', ') : ''}`,
                    type: 'error'
                });
                toast({
                    title: "Payment Failed",
                    description: errorMessage,
                    variant: "destructive"
                });
                console.error('Backend response error:', data);
            }
        } catch (error) {
            // Handle network errors (e.g., backend server not reachable)
            setMessage({
                text: `Network error: Could not connect to backend. Please ensure the backend server is running and reachable.`,
                type: 'error'
            });
            toast({
                title: "Network Error",
                description: "Failed to connect to the payment backend. Please check your internet connection.",
                variant: "destructive"
            });
            console.error('Fetch error:', error);
        }
    };

    // Pre-fill email if available from authState
    useEffect(() => { // Changed React.useEffect to useEffect directly
        if (authState.user?.email) {
            setCustomerEmail(authState.user.email);
        }
    }, [authState.user?.email]);

    return (
        // Overlay for the dialog, covers the whole screen
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            {/* Dialog content container */}
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fade-in-up">
                {/* Close button for the dialog */}
                <button
                    onClick={onClose} // Call the onClose prop when button is clicked
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Close dialog"
                >
                    &times;
                </button>

                {/* Dialog title */}
                <h1 className="text-xl font-bold mb-4 text-gray-800">Top Up Health Card</h1>
                {card && (
                    <p className="text-sm text-gray-600 mb-4">
                        Topping up for: <span className="font-semibold">{card.cardType.replace(/_/g, ' ')} ({card.cardNumber})</span>
                    </p>
                )}

                {/* Payment form */}
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">Customer Email:</label>
                        <input
                            type="email"
                            id="customerEmail"
                            name="customerEmail"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            required
                            placeholder="customer@example.com"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (e.g., 100.00):</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            step="0.01"
                            min="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="1.00"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency (e.g., INR, USD):</label>
                        <input
                            type="text"
                            id="currency"
                            name="currency"
                            maxLength={3}
                            required
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                            placeholder="INR"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm uppercase transition-all duration-200"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                        Pay Now with Payomatix
                    </button>
                </form>

                {/* Message display area */}
                {message.text && (
                    <div
                        className={`mt-4 p-3 rounded-md text-sm ${
                            message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' :
                            'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                        role="alert"
                    >
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentDialog;
