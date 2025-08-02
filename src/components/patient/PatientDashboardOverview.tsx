import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  Activity,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchPatientDashboardData, type PatientDashboardData } from "@/services/patientDashboardService";
import { toast } from "@/hooks/use-toast";

const PatientDashboardOverview = () => {
  const { authState } = useAuth();
  const [dashboardData, setDashboardData] = useState<PatientDashboardData | null>(null);
  const [loans, setLoans] = useState<PatientDashboardData['loans']>([]);
  const [currentLoanIndex, setCurrentLoanIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      console.log('Fetching dashboard data...');
      const data = await fetchPatientDashboardData();
      
      // Update nextEmiDate for each loan to be the 2nd of the next month
      const updatedLoans = data.loans.map(loan => {
        let currentDate = new Date();
        let nextMonth = currentDate.getMonth() + 1;
        let nextYear = currentDate.getFullYear();
        if (nextMonth === 12) {
          nextMonth = 0;
          nextYear += 1;
        }
        return {
          ...loan,
          nextEmiDate: new Date(nextYear, nextMonth, 2).toISOString()
        };
      });
      
      setDashboardData({
        ...data,
        loans: updatedLoans
      });
      setLoans(updatedLoans); // Store loans separately
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Using demo data.",
        variant: "destructive"
      });
      
      // Fallback to demo data with updated nextEmiDate
      let currentDate = new Date();
      let nextMonth = currentDate.getMonth() + 1;
      let nextYear = currentDate.getFullYear();
      if (nextMonth === 12) {
        nextMonth = 0;
        nextYear += 1;
      }
      const nextEmiDate = new Date(nextYear, nextMonth, 2).toISOString();
      
      const demoLoans = [
        {
          id: 1,
          loanApplicationNumber: "MLA851535122",
          amount: 100000,
          remainingBalance: 75000,
          nextEmiDate: nextEmiDate,
          emiAmount: 3500,
          status: "active",
          approvedDate: "2024-02-02"
        },
        {
          id: 2,
          loanApplicationNumber: "MLA851535123",
          amount: 50000,
          remainingBalance: 30000,
          nextEmiDate: nextEmiDate,
          emiAmount: 2000,
          status: "active",
          approvedDate: "2024-03-04"
        }
      ];
      
      setDashboardData({
        healthCards: [{
          balance: 45000,
          limit: 50000,
          cardNumber: "****-****-****-1234",
          status: "active",
          expiryDate: "12/2025",
          usedCredit: 5000
        }],
        loans: demoLoans,
        recentTransactions: [
          {
            id: "1",
            description: "Medical Consultation",
            amount: -1500,
            date: "2024-01-10",
            status: "completed",
            type: "debit"
          },
          {
            id: "2",
            description: "EMI Payment",
            amount: -3500,
            date: "2024-01-08",
            status: "completed",
            type: "debit"
          },
          {
            id: "3",
            description: "Health Card Top-up",
            amount: 5000,
            date: "2024-01-05",
            status: "completed",
            type: "credit"
          }
        ],
        notifications: [
          {
            id: "1",
            title: "EMI Reminder",
            message: `Your next EMI of ₹3,500 is due on ${new Date(nextEmiDate).toLocaleDateString()}`,
            type: "reminder",
            unread: true,
            createdAt: new Date().toISOString()
          }
        ],
        stats: {
          totalHealthCards: 1,
          activeLoans: 2,
          totalSpent: 5000,
          creditUtilization: 10
        }
      });
      setLoans(demoLoans); // Store demo loans separately
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      console.log('Auto-refreshing dashboard data...');
      fetchData();
    }, 30000);

    // Auto-slide for Next EMI card
    const slideInterval = setInterval(() => {
      setCurrentLoanIndex((prevIndex) => 
        loans.length > 0 ? (prevIndex + 1) % loans.length : 0
      );
    }, 5000); // Change loan every 5 seconds

    return () => {
      clearInterval(interval);
      clearInterval(slideInterval);
    };
  }, [loans.length]); // Depend on loans.length to reset index when loans change

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setCurrentLoanIndex(0); // Reset to first loan on refresh
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button onClick={fetchData} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Calculate total balance and limit for quick stats
  const totalBalance = dashboardData.healthCards.reduce((sum, card) => sum + (card.balance || 0), 0);
  const totalRemainingLoan = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);
  const totalLimit = dashboardData.healthCards.reduce((sum, card) => sum + (card.limit || 0), 0);
  const totalHealthCardUsage = totalLimit > 0 ? ((totalLimit - totalBalance) / totalLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {authState.user?.firstName || 'Patient'}!
            </h1>
            <p className="opacity-90">
              Here's your real-time health cards and financial status
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Cards Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              of ₹{totalLimit.toLocaleString()} limit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">
              ₹{totalRemainingLoan.toLocaleString()} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next EMI</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loans.length > 0 ? (
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  ₹{loans[currentLoanIndex].emiAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Due on {new Date(loans[currentLoanIndex].nextEmiDate).toLocaleDateString()} <br/>
                  (Loan {loans[currentLoanIndex].loanApplicationNumber})
                </p>
                {loans.length > 1 && (
                  <div className="flex justify-center gap-1 mt-2">
                    {loans.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentLoanIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-muted-foreground">No active loans</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KYC Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl py-2 font-bold">
              <Badge variant={authState.user?.kycStatus === 'completed' ? 'default' : 'secondary'}>
                {authState.user?.kycStatus || 'Pending'}
              </Badge>
            </div>
            <p className="text-xs py-1 text-muted-foreground">
              {authState.user?.kycStatus === 'completed' ? 'Verified' : 'Action required'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Health Cards & Loan Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Health Cards Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData.healthCards.map((card, index) => (
              <div key={card.cardNumber} className={`space-y-4 ${index > 0 ? 'pt-4 border-t' : ''}`}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Card {index + 1} Used Amount</span>
                    <span>₹{(card.limit - card.balance).toLocaleString()}</span>
                  </div>
                  <Progress value={card.limit > 0 ? ((card.limit - card.balance) / card.limit) * 100 : 0} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Available: ₹{card.balance.toLocaleString()}</span>
                    <span>{card.limit > 0 ? ((card.limit - card.balance) / card.limit * 100).toFixed(1) : 0}% used</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Card Number</p>
                    <p className="text-xs text-muted-foreground">{card.cardNumber}</p>
                  </div>
                  <Badge variant="outline">{card.status}</Badge>
                </div>
              </div>
            ))}
            {dashboardData.healthCards.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p>No active health cards</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Loan Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loans.map((loan, index) => (
              <div key={loan.id} className={`space-y-4 ${index > 0 ? 'pt-4 border-t' : ''}`}>
                <div className="space-y-2">
                  <span>Loan No. {loan.loanApplicationNumber}<br/></span>
                  <div className="flex justify-between text-sm">
                    <span>Amount Paid</span>
                    <span>₹{(loan.amount - loan.remainingBalance).toLocaleString()}</span>
                  </div>
                  <Progress 
                    value={loan.amount > 0 ? ((loan.amount - loan.remainingBalance) / loan.amount) * 100 : 0} 
                    className="h-2" 
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Remaining: ₹{loan.remainingBalance.toLocaleString()}</span>
                    <span>{loan.amount > 0 ? ((loan.amount - loan.remainingBalance) / loan.amount * 100).toFixed(1) : 0}% paid</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Next EMI</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{loan.emiAmount.toLocaleString()} on {new Date(loan.nextEmiDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">{loan.status} on {new Date(loan.approvedDate).toLocaleDateString()}</Badge>
                </div>
              </div>
            ))}
            {loans.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p>No active loans</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 py-2">
                  <div className="mt-0.5">
                    {notification.type === 'reminder' ? (
                      <Clock className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboardOverview;