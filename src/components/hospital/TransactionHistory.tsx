import { useState, useEffect } from "react";
import { Download, Filter, Search, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { fetchTransactionHistory, Transaction } from "@/services/transactionService";

const TransactionHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  
  // State for real data fetching
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from backend
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTransactionHistory();
        setTransactions(data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
        toast({
          title: "Error",
          description: "Failed to load transactions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [toast]);

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Apply search term filter
    const searchLower = searchTerm.toLowerCase();
    const userInfo = typeof transaction.user === 'string' 
      ? transaction.user 
      : `${transaction.user.firstName} ${transaction.user.lastName} ${transaction.user.email}`;
    
    if (searchTerm && 
        !transaction._id?.toLowerCase().includes(searchLower) &&
        !userInfo.toLowerCase().includes(searchLower) && 
        !transaction.description.toLowerCase().includes(searchLower)) {
      return false;
    }

    // Apply date filter (simplified - in a real app, use proper date filtering)
    if (dateFilter === "today") {
      const today = new Date().toISOString().split('T')[0];
      const transactionDate = new Date(transaction.date || '').toISOString().split('T')[0];
      if (transactionDate !== today) return false;
    }
    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const transactionDate = new Date(transaction.date || '');
      if (transactionDate < weekAgo) return false;
    }
    if (dateFilter === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const transactionDate = new Date(transaction.date || '');
      if (transactionDate < monthAgo) return false;
    }

    // Apply type filter
    if (typeFilter !== "all" && transaction.type !== typeFilter) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== "all" && transaction.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setViewDetailsOpen(true);
  };

  const handleExportTransactions = () => {
    toast({
      title: "Export started",
      description: "Your transaction report is being generated",
    });
    // In a real app, this would generate and download a CSV/Excel file
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionId = (transaction: Transaction) => {
    return transaction._id ? `TRX-${transaction._id.slice(-6).toUpperCase()}` : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all financial transactions ({transactions.length} total)
              </CardDescription>
            </div>
            <Button onClick={handleExportTransactions} className="sm:w-auto w-full">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by ID, user name or description..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[220px] p-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Date Range</h4>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Transaction Type</h4>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="payment">Payments</SelectItem>
                          <SelectItem value="refund">Refunds</SelectItem>
                          <SelectItem value="charge">Charges</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Status</h4>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell className="font-medium">{getTransactionId(transaction)}</TableCell>
                      <TableCell>{transaction.date ? formatDate(transaction.date) : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {typeof transaction.user === 'string' 
                            ? transaction.user 
                            : `${transaction.user.firstName} ${transaction.user.lastName}`
                          }
                        </div>
                        {typeof transaction.user === 'object' && (
                          <div className="text-xs text-gray-500">{transaction.user.email}</div>
                        )}
                        {transaction.hospital && (
                          <div className="text-xs text-gray-500">{transaction.hospital}</div>
                        )}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${transaction.type === 'payment' ? 'bg-green-100 text-green-800' : ''}
                          ${transaction.type === 'refund' ? 'bg-amber-100 text-amber-800' : ''}
                          ${transaction.type === 'charge' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${transaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${transaction.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                          ${transaction.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(transaction)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {transactions.length === 0 ? 'No transactions found.' : 'No transactions match your filters. Try adjusting your search or filters.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>
                Full details for transaction {getTransactionId(selectedTransaction)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="text-sm font-mono">{getTransactionId(selectedTransaction)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="text-sm">{selectedTransaction.date ? formatDate(selectedTransaction.date) : 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">User</p>
                  <p className="text-sm">
                    {typeof selectedTransaction.user === 'string' 
                      ? selectedTransaction.user 
                      : `${selectedTransaction.user.firstName} ${selectedTransaction.user.lastName}`
                    }
                  </p>
                  {typeof selectedTransaction.user === 'object' && (
                    <p className="text-xs text-gray-500">{selectedTransaction.user.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Hospital</p>
                  <p className="text-sm">{selectedTransaction.hospital || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-sm">{selectedTransaction.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="text-sm capitalize">{selectedTransaction.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${selectedTransaction.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedTransaction.status === 'pending' ? 'bg-blue-100 text-blue-800' : ''}
                    ${selectedTransaction.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className={`text-sm font-medium ${selectedTransaction.type === 'refund' ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(selectedTransaction.amount).toLocaleString()}
                  {selectedTransaction.type === 'refund' ? ' (Refund)' : ''}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransactionHistory;
