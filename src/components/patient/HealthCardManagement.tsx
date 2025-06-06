
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Plus, IndianRupee, Wallet, Award, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { fetchUserHealthCards, applyForHealthCard, topUpHealthCard, type HealthCard } from "@/services/healthCardService";
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
  const [showTopUp, setShowTopUp] = useState(false);
  const [selectedCard, setSelectedCard] = useState<HealthCard | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');

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
      
      // Check KYC status first
      const kycData = await getKYCStatus();
      setKycStatus(kycData.kycStatus);
      if (kycData.uhid) {
        setUhid(kycData.uhid);
      }

      // Fetch health cards if KYC is completed
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

  const handleTopUp = async () => {
    if (!selectedCard || !topUpAmount) return;

    try {
      await topUpHealthCard(selectedCard._id, parseFloat(topUpAmount));
      
      // Update local state
      setHealthCards(prev => prev.map(card => 
        card._id === selectedCard._id 
          ? { ...card, availableCredit: card.availableCredit + parseFloat(topUpAmount) }
          : card
      ));

      setShowTopUp(false);
      setTopUpAmount('');
      setSelectedCard(null);

      toast({
        title: "Top-up Successful",
        description: `₹${topUpAmount} added to your health card`,
      });
    } catch (error: any) {
      toast({
        title: "Top-up Failed",
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
      'basic': { name: 'Basic Card', color: 'bg-blue-500', limit: '₹25,000' },
      'premium': { name: 'Premium Card', color: 'bg-purple-500', limit: '₹1,00,000' },
      'ricare_discount': { name: 'RI Medicare Discount Card', color: 'bg-green-500', limit: '₹50,000' }
    };
    return types[cardType as keyof typeof types] || types.basic;
  };

  // Show KYC completion if not verified
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
              Manage your health cards and wallet balance (UHID: {uhid})
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

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {healthCards.map((card) => {
          const cardInfo = getCardTypeInfo(card.cardType || 'basic');
          return (
            <Card key={card._id} className="relative overflow-hidden">
              <div className={`h-2 ${cardInfo.color}`}></div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cardInfo.name}</CardTitle>
                    <CardDescription>
                      Card: {card.cardNumber}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(card.status)}
                    {card.cardType === 'ricare_discount' && (
                      <Badge className="bg-green-100 text-green-800">
                        {card.discountPercentage}% Discount
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available Balance</span>
                    <span className="font-semibold">₹{card.availableCredit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Used Credit</span>
                    <span className="text-red-600">₹{card.usedCredit.toLocaleString()}</span>
                  </div>
                  {card.monthlyLimit && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Limit</span>
                      <span className="text-blue-600">₹{card.monthlyLimit.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {card.status === 'active' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCard(card);
                      setShowTopUp(true);
                    }}
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    Top Up
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

      {/* Top Up Dialog */}
      <Dialog open={showTopUp} onOpenChange={setShowTopUp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Health Card</DialogTitle>
            <DialogDescription>
              Add funds to your health card wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount to Top Up (₹)</Label>
              <Input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
                max="50000"
              />
            </div>
            <div className="flex gap-2">
              {[1000, 2500, 5000, 10000].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  size="sm"
                  onClick={() => setTopUpAmount(amount.toString())}
                >
                  ₹{amount}
                </Button>
              ))}
            </div>
            <Button onClick={handleTopUp} className="w-full">
              <IndianRupee className="h-4 w-4 mr-2" />
              Top Up ₹{topUpAmount}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthCardManagement;
