
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, PlusCircle, AlertCircle, ArrowRight, ShieldCheck, HelpCircle, CreditCard as CardIcon, Clock, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const HealthCardManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showDiscountCard, setShowDiscountCard] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  // Mock data
  const [healthCardData, setHealthCardData] = useState({
    cardNumber: "HC-78901-23456",
    cardType: "Gold Health Card",
    availableBalance: 25000,
    usedAmount: 15000,
    totalCredit: 40000,
    expiryDate: "31/12/2026",
    lastTransaction: "20/11/2023",
    status: "Active",
  });

  const [discountCardData, setDiscountCardData] = useState({
    cardNumber: "DC-12345-67890",
    cardType: "RI Medicare Discount Card",
    expiryDate: "31/12/2026",
    status: "Active",
    lastUsed: "15/10/2023",
    discountReceived: "₹3,200",
    insuranceCover: "₹50,000",
    dailyCashBenefit: "₹3,000/day",
  });

  const recentTransactions = [
    { date: "22/11/2023", hospital: "City General Hospital", service: "Consultation", amount: 2500, status: "Completed" },
    { date: "15/11/2023", hospital: "Medicare Pharmacy", service: "Medication", amount: 1800, status: "Completed" },
    { date: "10/11/2023", hospital: "City General Hospital", service: "Lab Tests", amount: 3500, status: "Completed" },
    { date: "05/11/2023", hospital: "Wellness Clinic", service: "Physiotherapy", amount: 1200, status: "Completed" },
  ];

  const discountHistory = [
    { date: "15/10/2023", hospital: "City General Hospital", service: "Health Checkup", originalAmount: 5000, discountAmount: 750, finalAmount: 4250 },
    { date: "28/09/2023", hospital: "Medicare Pharmacy", service: "Medication", originalAmount: 3000, discountAmount: 450, finalAmount: 2550 },
    { date: "10/09/2023", hospital: "Wellness Clinic", service: "Dental Care", originalAmount: 8000, discountAmount: 1200, finalAmount: 6800 },
    { date: "21/08/2023", hospital: "LifeCare Hospital", service: "Consultation", originalAmount: 1500, discountAmount: 150, finalAmount: 1350 },
  ];

  const upcomingPayments = [
    { dueDate: "15/12/2023", amount: 2000, description: "EMI for Health Procedure", status: "Upcoming" },
    { dueDate: "15/01/2024", amount: 2000, description: "EMI for Health Procedure", status: "Upcoming" },
    { dueDate: "15/02/2024", amount: 2000, description: "EMI for Health Procedure", status: "Upcoming" },
  ];

  const handleAddMoney = () => {
    toast({
      title: "Add Money to Health Card",
      description: "Please use UPI or net banking to add money to your health card.",
    });
  };

  const handleDownloadStatement = () => {
    toast({
      title: "Statement Download",
      description: "Your health card statement is being downloaded.",
    });
  };

  const handleApplyDiscountCard = () => {
    toast({
      title: "Discount Card Application",
      description: "Your application for RI Medicare Discount Card has been submitted. We'll notify you once approved.",
    });
    // Show the discount card after application (simulating instant approval)
    setTimeout(() => {
      setShowDiscountCard(true);
    }, 2000);
  };

  const handleRenewCard = () => {
    toast({
      title: "Card Renewal",
      description: "Your card renewal process has been initiated. You will receive a notification once completed.",
    });
  };

  const handleReportIssue = () => {
    toast({
      title: "Issue Reported",
      description: "Your issue has been reported. Our customer support team will contact you within 24 hours.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Card Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-2/3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Health Card</CardTitle>
                    <CardDescription>Manage your medical expenses with ease</CardDescription>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="p-4 bg-gradient-to-r from-primary/80 to-primary rounded-lg text-white">
                    <div className="flex justify-between mb-2">
                      <div className="text-sm opacity-80">RI Medicare</div>
                      <div className="text-sm font-semibold">{healthCardData.cardType}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm opacity-80">Card Number</div>
                      <div className="font-mono text-xl">{healthCardData.cardNumber}</div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm opacity-80">Expiry</div>
                        <div>{healthCardData.expiryDate}</div>
                      </div>
                      <div>
                        <div className="text-sm opacity-80">Status</div>
                        <div className="flex items-center">
                          <Badge variant="secondary" className="bg-green-500 text-white">
                            {healthCardData.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                    <p className="text-2xl font-bold">₹{healthCardData.availableBalance.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Used Credit</p>
                    <p className="text-2xl font-bold">₹{healthCardData.usedAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Credit Limit</p>
                    <p className="text-2xl font-bold">₹{healthCardData.totalCredit.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="relative pt-2 mb-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Credit Utilization</span>
                    <span>{Math.round((healthCardData.usedAmount / healthCardData.totalCredit) * 100)}%</span>
                  </div>
                  <Progress value={(healthCardData.usedAmount / healthCardData.totalCredit) * 100} className="h-2" />
                </div>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={handleAddMoney}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Money
                </Button>
                <Button variant="outline" onClick={handleDownloadStatement}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Statement
                </Button>
                <Button variant="outline" onClick={handleRenewCard}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Renew Card
                </Button>
                <Button variant="outline" onClick={handleReportIssue}>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report Issue
                </Button>
                <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="ml-auto">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Card Help Center</DialogTitle>
                      <DialogDescription>
                        Find answers to common questions about your health card
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="border-b pb-2">
                        <h4 className="font-medium">How do I increase my credit limit?</h4>
                        <p className="text-sm text-muted-foreground">
                          You can request a credit limit increase through the "Card Settings" option or by contacting our customer support.
                        </p>
                      </div>
                      <div className="border-b pb-2">
                        <h4 className="font-medium">What happens if I miss a payment?</h4>
                        <p className="text-sm text-muted-foreground">
                          Late payment fees and additional interest may be charged. Set up auto-debit to avoid missing payments.
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium">How to report a lost card?</h4>
                        <p className="text-sm text-muted-foreground">
                          Use the "Report Issue" button and select "Lost Card" from the options or contact our 24/7 helpline.
                        </p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setShowHelpDialog(false)}>Close</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>

            <div className="w-full md:w-1/3 space-y-6">
              {showDiscountCard ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center text-base font-medium">
                      <CardIcon className="h-5 w-5 mr-2 text-green-600" />
                      RI Medicare Discount Card
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white mb-4">
                      <div className="text-xs opacity-90 mb-1">Card Number</div>
                      <div className="font-mono text-sm mb-2">{discountCardData.cardNumber}</div>
                      <div className="flex justify-between text-xs">
                        <div>
                          <div className="opacity-90">Expires</div>
                          <div>{discountCardData.expiryDate}</div>
                        </div>
                        <div>
                          <div className="opacity-90">Status</div>
                          <div>{discountCardData.status}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Insurance Cover:</span>
                        <span className="font-medium">{discountCardData.insuranceCover}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Daily Cash Benefit:</span>
                        <span className="font-medium">{discountCardData.dailyCashBenefit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Discounts:</span>
                        <span className="font-medium">{discountCardData.discountReceived}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Discount History
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>RI Medicare Discount Card</CardTitle>
                    <CardDescription>Get instant discounts on all medical expenses</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1 bg-green-500">10-15%</Badge>
                      <div>
                        <h4 className="font-medium">Instant Hospital Discounts</h4>
                        <p className="text-sm text-muted-foreground">Get flat discounts on bills at partner hospitals</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1">₹50,000</Badge>
                      <div>
                        <h4 className="font-medium">Complimentary Insurance</h4>
                        <p className="text-sm text-muted-foreground">Health insurance coverage up to ₹50,000</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Badge className="mt-1">₹3,000</Badge>
                      <div>
                        <h4 className="font-medium">Daily Cash Benefits</h4>
                        <p className="text-sm text-muted-foreground">Receive up to ₹3,000 per day for hospital stays</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Annual fee: <span className="font-medium">₹1,770</span>
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleApplyDiscountCard}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Card Security
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Clock className="mr-2 h-4 w-4" />
                      EMI Calculator
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <HospitalIcon className="mr-2 h-4 w-4" />
                      Find Hospital
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Card Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your recent health card usage</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadStatement}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="credit">
                <TabsList className="mb-4">
                  <TabsTrigger value="credit">Credit Card Transactions</TabsTrigger>
                  <TabsTrigger value="discount">Discount Card Benefits</TabsTrigger>
                </TabsList>
                <TabsContent value="credit">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentTransactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.hospital}</TableCell>
                          <TableCell>{transaction.service}</TableCell>
                          <TableCell className="text-right">₹{transaction.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                <TabsContent value="discount">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Hospital</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Original Amount</TableHead>
                        <TableHead className="text-right">Discount</TableHead>
                        <TableHead className="text-right">Final Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {discountHistory.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.hospital}</TableCell>
                          <TableCell>{transaction.service}</TableCell>
                          <TableCell className="text-right">₹{transaction.originalAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-green-600">- ₹{transaction.discountAmount.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">₹{transaction.finalAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">View All Transactions</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Payments</CardTitle>
                  <CardDescription>Manage your EMIs and scheduled payments</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="mr-2 h-4 w-4" />
                  Set Reminders
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingPayments.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell className="text-right">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-50 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium">Auto-debit setup</h4>
                  <p className="text-sm text-muted-foreground">Never miss a payment by setting up auto-debit</p>
                </div>
                <Button className="mt-2 sm:mt-0">Set Up Auto-debit</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Additional icons used in the component
const Eye = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
};

const Filter = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
};

const Bell = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
};

const Settings = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
};

const HospitalIcon = ({ className }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 22H2"/><path d="M17 2H7a5 5 0 0 0-5 5v15h20V7a5 5 0 0 0-5-5Z"/><path d="M14 22V15a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2v7"/><path d="M10 7h4"/><path d="M12 5v4"/></svg>
};

export default HealthCardManagement;
