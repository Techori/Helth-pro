import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, IndianRupee, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserHealthCards, applyForHealthCard, type HealthCard, payHealthCardCredit } from "@/services/healthCardService";
import { getKYCStatus } from "@/services/kycService";
import KycCompletion from "./KycCompletion";
import axios from "axios"; // Assuming axios is used for API calls
import PaymentDialog from './PaymentDialog'; // Import the PaymentDialog component



const HealthCardManagement = () => {
    const { toast } = useToast();
    const { authState } = useAuth();
    const [healthCards, setHealthCards] = useState<HealthCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [kycStatus, setKycStatus] = useState<string>('pending');
    const [uhid, setUhid] = useState<string>('');
    const [showApplication, setShowApplication] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showTopUpPayment, setShowTopUpPayment] = useState(false); // New state for PaymentDialog visibility
    const [selectedCard, setSelectedCard] = useState<HealthCard | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentCardId, setPaymentCardId] = useState<string>('');

    const [applicationForm, setApplicationForm] = useState({
        cardType: 'health_paylater' as 'health_paylater' | 'health_emi' | 'health_50_50' | 'ri_medicare_discount',
        requestedCreditLimit: 25000,
        medicalHistory: '',
        monthlyIncome: 0,
        employmentStatus: 'employed'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const kycData = await getKYCStatus();
            setKycStatus(kycData.kycStatus);
            setUhid(kycData.uhid || ''); // Default to empty string if uhid is missing
            if (kycData.kycStatus === 'completed') {
                const cards = await fetchUserHealthCards(authState.token || '');
                setHealthCards(cards);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast({
                title: "Error",
                description: "Failed to load data. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApplyForCard = async () => {
        try {
            if (!authState.token) {
                toast({
                    title: "Authentication Error",
                    description: "Please log in again.",
                    variant: "destructive"
                });
                return;
            }

            const newCard = await applyForHealthCard(applicationForm, authState.token);
            setHealthCards(prev => [...prev, newCard]);
            setShowApplication(false);
            toast({
                title: "Health Card Application Submitted",
                description: "Your application is pending admin approval.",
            });
        } catch (error: any) {
            toast({
                title: "Application Failed",
                description: error.message || "Please try again",
                variant: "destructive"
            });
        }
    };

    const handlePayCredit = async () => {
        if (!selectedCard || !paymentAmount || !paymentCardId || !authState.token) return;

        try {
            const response = await payHealthCardCredit(paymentCardId, parseFloat(paymentAmount), 'online', authState.token);

            if (!response) throw new Error('Payment failed');

            const data = response;
            setHealthCards(prev => prev.map(card =>
                card._id === paymentCardId
                    ? {
                        ...card,
                        usedCredit: data.newUsedCredit,
                        availableCredit: data.newAvailableCredit
                    }
                    : card
            ));

            setShowPayment(false);
            setPaymentAmount('');
            setSelectedCard(null);
            setPaymentCardId('');

            toast({
                title: "Payment Successful",
                description: `₹${paymentAmount} paid towards your health card credit`,
            });
        } catch (error: any) {
            console.error('Payment failed:', error);
            toast({
                title: "Payment Failed",
                description: error.response?.data?.msg || error.message || "Please try again",
                variant: "destructive"
            });
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'approved': 'bg-blue-100 text-blue-800',
            'active': 'bg-green-100 text-green-800',
            'expired': 'bg-red-100 text-red-800',
            'suspended': 'bg-gray-100 text-gray-800'
        };
        return <Badge className={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Badge>;
    };

    const getCardTypeInfo = (cardType: string) => {
        const types = {
            'health_paylater': { name: 'Health PayLater Card', color: 'bg-orange-500', limit: 25000, annualFee: 4720 },
            'health_emi': { name: 'Health EMI Card', color: 'bg-red-500', limit: 100000, annualFee: 4720 },
            'health_50_50': { name: 'Health 50-50 Card', color: 'bg-purple-500', limit: 50000, annualFee: 2360 },
            'ri_medicare_discount': { name: 'RI Medicare Discount Card', color: 'bg-green-500', limit: 50000, annualFee: 1770 }
        };
        return types[cardType as keyof typeof types] || types.health_paylater;
    };

    // Handler for successful payment from PaymentDialog
    const handleTopUpSuccess = () => {
        setShowTopUpPayment(false);
        fetchData(); // Re-fetch health cards to update balances
        toast({
            title: "Top Up Successful",
            description: "Your health card credit has been topped up.",
        });
    };

    if (kycStatus !== 'completed') {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Health Card Management</CardTitle>
                        <CardDescription>
                            Complete KYC verification to apply for health cards
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {kycStatus === 'pending' ? (
                            <KycCompletion onComplete={(newUhid) => {
                                setUhid(newUhid);
                                setKycStatus('completed');
                                fetchData();
                            }} />
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-gray-600">KYC verification is {kycStatus}. Please contact support.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Health Card Management
                        </CardTitle>
                        <CardDescription>
                            Manage your health cards and credit limits (UHID: {uhid || 'Not assigned'})
                        </CardDescription>
                    </div>
                    <Dialog open={showApplication} onOpenChange={setShowApplication}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Apply for Card
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Apply for Health Card</DialogTitle>
                                <DialogDescription>
                                    Choose the type of health card you want to apply for
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Card Type</Label>
                                    <Select
                                        value={applicationForm.cardType}
                                        onValueChange={(value: any) => setApplicationForm(prev => ({ ...prev, cardType: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="health_paylater">Health PayLater Card (₹25,000, ₹4,720/yr)</SelectItem>
                                            <SelectItem value="health_emi">Health EMI Card (₹1,00,000, ₹4,720/yr)</SelectItem>
                                            <SelectItem value="health_50_50">Health 50-50 Card (₹50,000, ₹2,360/yr)</SelectItem>
                                            <SelectItem value="ri_medicare_discount">RI Medicare Discount Card (₹50,000, ₹1,770/yr)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Requested Credit Limit</Label>
                                    <Input
                                        type="number"
                                        value={applicationForm.requestedCreditLimit}
                                        onChange={(e) => setApplicationForm(prev => ({
                                            ...prev,
                                            requestedCreditLimit: parseInt(e.target.value) || 0
                                        }))}
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <Label>Monthly Income</Label>
                                    <Input
                                        type="number"
                                        value={applicationForm.monthlyIncome}
                                        onChange={(e) => setApplicationForm(prev => ({
                                            ...prev,
                                            monthlyIncome: parseInt(e.target.value) || 0
                                        }))}
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <Label>Employment Status</Label>
                                    <Select
                                        value={applicationForm.employmentStatus}
                                        onValueChange={(value) => setApplicationForm(prev => ({ ...prev, employmentStatus: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="employed">Employed</SelectItem>
                                            <SelectItem value="self_employed">Self Employed</SelectItem>
                                            <SelectItem value="business">Business Owner</SelectItem>
                                            <SelectItem value="retired">Retired</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button onClick={handleApplyForCard} className="w-full">
                                    Submit Application
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {healthCards.map((card) => {
                    const cardInfo = getCardTypeInfo(card.cardType);
                    return (
                        <Card key={card._id} className="relative overflow-hidden border-2 rounded-xl shadow-lg">
                            <div className={`h-2 ${cardInfo.color}`}></div>
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg font-bold">{cardInfo.name}</CardTitle>
                                        <CardDescription className="font-mono">
                                            {card.cardNumber}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(card.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Approved Limit</span>
                                        <span className="font-semibold text-green-600">₹{card.approvedCreditLimit?.toLocaleString() || cardInfo.limit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Limit Used</span>
                                        <span className="font-semibold text-red-600">₹{card.usedCredit.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Available Balance</span>
                                        <span className="font-semibold">₹{(card.availableCredit || cardInfo.limit - card.usedCredit).toLocaleString()}</span>
                                    </div>
                                    {card.cardType === 'ri_medicare_discount' && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Discount</span>
                                            <span className="font-semibold text-green-600">{card.discountPercentage || 15}%</span>
                                        </div>
                                    )}
                                    {card.cardType === 'health_emi' && card.interestRate && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Interest Rate</span>
                                            <span className="font-semibold text-red-600">{card.interestRate}%</span>
                                        </div>
                                    )}
                                    {card.cardType === 'health_paylater' && card.zeroInterestMonths && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">0% Interest Months</span>
                                            <span className="font-semibold text-green-600">{card.zeroInterestMonths}</span>
                                        </div>
                                    )}
                                    {/* Top Up Button */}
                                    <div className="pt-4">
                                        <button
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                                            onClick={() => {
                                                setSelectedCard(card);
                                                setShowTopUpPayment(true); // Open the PaymentDialog
                                            }}
                                        >
                                            Top Up
                                        </button>
                                    </div>
                                </div>

                                {card.status === 'active' && card.usedCredit > 0 && (
                                    <Button
                                        variant="default"
                                        className="w-full bg-blue-600 hover:bg-blue-700"
                                        onClick={() => {
                                            setSelectedCard(card);
                                            setPaymentCardId(card._id);
                                            setShowPayment(true);
                                        }}
                                    >
                                        <IndianRupee className="h-4 w-4 mr-2" />
                                        Pay Credit
                                    </Button>
                                )}

                                <div className="text-xs text-gray-500">
                                    {card.issueDate && (
                                        <div>Issued: {new Date(card.issueDate).toLocaleDateString()}</div>
                                    )}
                                    {card.expiryDate && (
                                        <div>Expires: {new Date(card.expiryDate).toLocaleDateString()}</div>
                                    )}
                                    <div>Annual Fee: ₹{cardInfo.annualFee.toLocaleString()}</div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {healthCards.length === 0 && !loading && (
                <Card>
                    <CardContent className="text-center p-8">
                        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">No health cards found</p>
                        <p className="text-sm text-gray-500">Apply for your first health card to get started</p>
                    </CardContent>
                </Card>
            )}

            <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pay Health Card Credit</DialogTitle>
                        <DialogDescription>
                            Select a health card and enter amount to pay towards used credit
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Select Health Card</Label>
                            <Select
                                value={paymentCardId}
                                onValueChange={setPaymentCardId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a card" />
                                </SelectTrigger>
                                <SelectContent>
                                    {healthCards
                                        .filter(card => card.status === 'active' && card.usedCredit > 0)
                                        .map(card => (
                                            <SelectItem key={card._id} value={card._id}>
                                                {getCardTypeInfo(card.cardType).name} - {card.cardNumber}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Amount to Pay (₹)</Label>
                            <Input
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const max = selectedCard?.usedCredit || 0;
                                    setPaymentAmount(value && parseFloat(value) <= max ? value : max.toString());
                                }}
                                placeholder="Enter amount"
                                min="100"
                                max={selectedCard?.usedCredit.toString() || "0"}
                            />
                        </div>
                        <div className="flex gap-2">
                            {[1000, 2500, 5000, 10000].map(amount => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const max = selectedCard?.usedCredit || 0;
                                        setPaymentAmount(Math.min(amount, max).toString());
                                    }}
                                    disabled={!selectedCard || amount > (selectedCard?.usedCredit || 0)}
                                >
                                    ₹{amount}
                                </Button>
                            ))}
                        </div>
                        <Button
                            onClick={handlePayCredit}
                            className="w-full"
                            disabled={!paymentCardId || !paymentAmount || parseFloat(paymentAmount) <= 0 || (selectedCard?.usedCredit || 0) < parseFloat(paymentAmount)}
                        >
                            <IndianRupee className="h-4 w-4 mr-2" />
                            Pay ₹{paymentAmount}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* PaymentDialog for Top Up */}
{selectedCard && (
   <PaymentDialog
    isOpen={showTopUpPayment}
    onClose={() => {
        setShowTopUpPayment(false);
        if (selectedCard) {
            setSelectedCard(null); 
        }
    }}
    card={selectedCard}
    onPaymentSuccess={handleTopUpSuccess}
/>
)}
        </div>
    );
};

export default HealthCardManagement;