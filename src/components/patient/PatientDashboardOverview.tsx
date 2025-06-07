import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, CreditCard, Calendar, ArrowUpRight, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchUserHealthCards } from "@/services/healthCardService";
import { fetchUserTransactions } from "@/services/transactionService";
import { fetchPatientLoans } from "@/services/loanService";
import { useAuth } from "@/hooks/useAuth";

interface Transaction {
  _id?: string;
  amount: number;
  type: string;
  description: string;
  hospital?: string;
  date?: string;
  status: string;
}

interface Loan {
  _id: string;
  applicationNumber: string;
  status: string;
  loanDetails: {
    requestedAmount: number;
    approvedAmount?: number;
    preferredTerm: number;
    interestRate?: number;
  };
  monthlyPayment?: number;
  remainingBalance?: number;
  nextEmiDate?: string;
}

const PatientDashboardOverview = () => {
  const { authState } = useAuth();
  const [healthCards, setHealthCards] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!authState.user?.uhid) {
          console.error('No UHID found for user');
          return;
        }

        const [cardsData, transactionsData, loansData] = await Promise.all([
          fetchUserHealthCards(),
          fetchUserTransactions(),
          fetchPatientLoans(authState.user.uhid)
        ]);
        
        setHealthCards(cardsData || []);
        setTransactions(transactionsData?.slice(0, 5) || []);
        setLoans(loansData || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authState.user?.uhid]);

  // Calculate totals
  const totalAvailableCredit = healthCards.reduce((sum, card) => sum + (card.availableCredit || 0), 0);
  const totalUsedCredit = healthCards.reduce((sum, card) => sum + (card.usedCredit || 0), 0);
  const activeLoansCount = loans.filter(loan => loan.status === 'active').length;
  const totalLoanAmount = loans.reduce((sum, loan) => sum + (loan.remainingBalance || 0), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Card Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAvailableCredit.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <span>Total Available</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {healthCards.length} Active Card{healthCards.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Used Credit */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Used Credit</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalUsedCredit.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-blue-600">
              <span>Total Utilized</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Last transaction: {transactions[0]?.date ? new Date(transactions[0].date).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoansCount}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>Outstanding Loans</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Total Amount: ₹{totalLoanAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Health Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Activity</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>Recent Transactions</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This month's activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Health Card Transactions</CardTitle>
          <CardDescription>
            Your recent health card payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hospital/Vendor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.hospital || 'Healthcare Provider'}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-right">
                      ₹{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">No transactions found</p>
          )}
        </CardContent>
      </Card>

      {/* Active Loans Details */}
      {loans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
            <CardDescription>
              Your active medical loans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Remaining Amount</TableHead>
                  <TableHead>Monthly EMI</TableHead>
                  <TableHead>Next Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="font-medium">{loan._id.slice(-8)}</TableCell>
                    <TableCell>₹{loan.remainingBalance}</TableCell>
                    <TableCell>₹{loan.monthlyPayment}</TableCell>
                    <TableCell>{new Date(loan.nextEmiDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientDashboardOverview;
