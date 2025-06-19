
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Filter, CreditCard, Calendar, User, AlertCircle } from "lucide-react";
import { fetchAllTransactions, Transaction } from "@/services/transactionService";
import { fetchAllLoans, LoanData } from "@/services/loanService";
import { useToast } from "@/hooks/use-toast";

interface PendingEmi {
  loanId: string;
  applicationNumber: string;
  patientName: string;
  uhid: string;
  nextEmiDate: string;
  emiAmount: number;
  overdueAmount: number;
  status: 'pending' | 'overdue';
}

const AdminTransactionManagement = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingEmis, setPendingEmis] = useState<PendingEmi[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filteredEmis, setFilteredEmis] = useState<PendingEmi[]>([]);
  const [transactionSearch, setTransactionSearch] = useState("");
  const [emiSearch, setEmiSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all transactions
      const transactionData = await fetchAllTransactions();
      setTransactions(transactionData);
      setFilteredTransactions(transactionData);

      // Fetch all loans to get pending EMIs
      const loanData = await fetchAllLoans();
      const pendingEmiData = loanData
        .filter(loan => loan.status === 'approved' || loan.status === 'disbursed')
        .filter(loan => loan.remainingBalance && loan.remainingBalance > 0)
        .map(loan => {
          const nextEmiDate = new Date(loan.nextEmiDate || new Date());
          const isOverdue = nextEmiDate < new Date();
          
          return {
            loanId: loan._id,
            applicationNumber: loan.applicationNumber,
            patientName: `${loan.personalInfo?.fullName || 'Unknown'}`,
            uhid: loan.uhid,
            nextEmiDate: nextEmiDate.toISOString(),
            emiAmount: loan.monthlyPayment || 0,
            overdueAmount: isOverdue ? (loan.monthlyPayment || 0) : 0,
            status: isOverdue ? 'overdue' as const : 'pending' as const
          };
        });
      
      setPendingEmis(pendingEmiData);
      setFilteredEmis(pendingEmiData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transaction and EMI data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = transactions.filter(transaction =>
      transaction.description.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      transaction.hospital?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      transaction._id.toLowerCase().includes(transactionSearch.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [transactionSearch, transactions]);

  useEffect(() => {
    const filtered = pendingEmis.filter(emi =>
      emi.patientName.toLowerCase().includes(emiSearch.toLowerCase()) ||
      emi.uhid.toLowerCase().includes(emiSearch.toLowerCase()) ||
      emi.applicationNumber.toLowerCase().includes(emiSearch.toLowerCase())
    );
    setFilteredEmis(filtered);
  }, [emiSearch, pendingEmis]);

  const getTransactionStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmiStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExportTransactions = () => {
    toast({
      title: "Export Started",
      description: "Exporting transaction data to Excel...",
    });
  };

  const handleExportEmis = () => {
    toast({
      title: "Export Started",
      description: "Exporting EMI data to Excel...",
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading transaction and EMI data...</div>;
  }

  const totalTransactions = transactions.length;
  const totalTransactionAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const overdueEmis = pendingEmis.filter(emi => emi.status === 'overdue');
  const totalOverdueAmount = overdueEmis.reduce((sum, emi) => sum + emi.overdueAmount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-gray-500 mt-3">All time transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalTransactionAmount.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-3">Total transaction amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending EMIs</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingEmis.length}</div>
            <p className="text-xs text-gray-500 mt-3">Total pending EMIs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalOverdueAmount.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-3">{overdueEmis.length} overdue EMIs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="emis">Pending EMIs</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Management</CardTitle>
              <CardDescription>
                View and manage all patient transactions across the platform
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by transaction ID, description, or hospital..."
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleExportTransactions}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction._id}>
                        <TableCell className="font-mono text-sm">{transaction._id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.type}</Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{transaction.hospital || 'N/A'}</TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-500">
                    {transactionSearch ? 'No transactions match your search criteria.' : 'No transactions have been recorded yet.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emis">
          <Card>
            <CardHeader>
              <CardTitle>Pending EMI Management</CardTitle>
              <CardDescription>
                Track and manage pending EMI payments from patients
              </CardDescription>
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by patient name, UHID, or loan number..."
                    value={emiSearch}
                    onChange={(e) => setEmiSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleExportEmis}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredEmis.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Loan Number</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>UHID</TableHead>
                      <TableHead>Next EMI Date</TableHead>
                      <TableHead className="text-right">EMI Amount</TableHead>
                      <TableHead className="text-right">Overdue Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmis.map((emi) => (
                      <TableRow key={emi.loanId}>
                        <TableCell className="font-mono">{emi.applicationNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-500" />
                            {emi.patientName}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{emi.uhid}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {new Date(emi.nextEmiDate).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ₹{emi.emiAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {emi.overdueAmount > 0 ? (
                            <span className="text-red-600">₹{emi.overdueAmount.toLocaleString()}</span>
                          ) : (
                            <span className="text-gray-500">₹0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={getEmiStatusColor(emi.status)}>
                            {emi.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending EMIs found</h3>
                  <p className="text-gray-500">
                    {emiSearch ? 'No EMIs match your search criteria.' : 'All EMI payments are up to date.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTransactionManagement;
