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
import { fetchUserHealthCards, applyForHealthCard, type HealthCard } from "@/services/healthCardService";
import { getKYCStatus } from "@/services/kycService";
import KycCompletion from "./KycCompletion";

const HealthCardManagement = () => {
  const { toast } = useToast();
  const { authState } = useAuth();
  const [healthCards, setHealthCards] = useState<HealthCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<string>('pending');
  const [uhid, setUhid] = useState<string>('');
  const [showApplication, setShowApplication] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCard, setSelectedCard] = useState<HealthCard | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentCardId, setPaymentCardId] = useState<string>('');

  const [applicationForm, setApplicationForm] = useState({
    cardType: 'basic' as 'basic' | 'premium' | 'ricare_discount',
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
      if (kycData.uhid) {
        setUhid(kycData.uhid);
      }

      if (kycData.kycStatus === 'completed') {
        const cards = await fetchUserHealthCards();
        setHealthCards(cards);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyForCard = async () => {
    try {
      const newCard = await applyForHealthCard(applicationForm);
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
    if (!selectedCard || !paymentAmount || !paymentCardId) return;

    try {
      // Simulate payment processing (you would replace this with actual API call)
      const response = await fetch(`/api/health-cards/${paymentCardId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(paymentAmount),
          paymentMethod: 'online'
        })
      });

      if (!response.ok) throw new Error('Payment failed');

      const data = await response.json();
      
      setHealthCards(prev => prev.map(card => 
        card._id === paymentCardId 
          ? { 
              ...card, 
              usedCredit: card.usedCredit - parseFloat(paymentAmount),
              availableCredit: card.availableCredit + parseFloat(paymentAmount)
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
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again",
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
      'basic': { name: 'Basic Card', color: 'bg-blue-500', limit: 25000 },
      'premium': { name: 'Premium Card', color: 'bg-purple-500', limit: 100000 },
      'ricare_discount': { name: 'RI Medicare Discount Card', color: 'bg-green-500', limit: 50000 }
    };
    return types[cardType as keyof typeof types] || types.basic;
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
              Manage your health cards and credit limits (UHID: {uhid})
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
                      <SelectItem value="basic">Basic Card (₹25,000 limit)</SelectItem>
                      <SelectItem value="premium">Premium Card (₹1,00,000 limit)</SelectItem>
                      <SelectItem value="ricare_discount">RI Medicare Discount Card (15% discount)</SelectItem>
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
                      requestedCreditLimit: parseInt(e.target.value) 
                    }))}
                  />
                </div>

                <div>
                  <Label>Monthly Income</Label>
                  <Input
                    type="number"
                    value={applicationForm.monthlyIncome}
                    onChange={(e) => setApplicationForm(prev => ({ 
                      ...prev, 
                      monthlyIncome: parseInt(e.target.value) 
                    }))}
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
          const cardInfo = getCardTypeInfo(card.cardType || 'basic');
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
                    <span className="font-semibold text-green-600">₹{cardInfo.limit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Limit Used</span>
                    <span className="font-semibold text-red-600">₹{card.usedCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Available Balance</span>
                    <span className="font-semibold">₹{(cardInfo.limit - card.usedCredit).toLocaleString()}</span>
                  </div>
                  {card.cardType === 'ricare_discount' && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Discount</span>
                      <span className="font-semibold text-green-600">{card.discountPercentage}%</span>
                    </div>
                  )}
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
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount to Pay (₹)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
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
                  onClick={() => setPaymentAmount(Math.min(amount, selectedCard?.usedCredit || amount).toString())}
                  disabled={!selectedCard || amount > (selectedCard?.usedCredit || 0)}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            <Button 
              onClick={handlePayCredit} 
              className="w-full"
              disabled={!paymentCardId || !paymentAmount || parseFloat(paymentAmount) <= 0}
            >
              <IndianRupee className="h-4 w-4 mr-2" />
              Pay ₹{paymentAmount}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthCardManagement;