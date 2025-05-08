
import { useState } from "react";
import { Download, Filter, Search } from "lucide-react";
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

const TransactionHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  // Mock transaction data - In a real app, this would come from an API
  const transactions = [
    { 
      id: "TRX-1001", 
      date: "2023-11-15 14:30", 
      patientId: "P78901", 
      patientName: "Rahul Sharma",
      description: "Health Card Payment", 
      type: "payment",
      amount: 8500, 
      status: "completed",
      paymentMethod: "Health Card",
      reference: "HC-9876543",
      notes: "Consultation and medication charges"
    },
    { 
      id: "TRX-1002", 
      date: "2023-11-14 10:15", 
      patientId: "P12345", 
      patientName: "Priya Patel",
      description: "EMI Collection", 
      type: "emi",
      amount: 3000, 
      status: "completed",
      paymentMethod: "Auto Debit",
      reference: "EMI-1234567",
      notes: "Monthly EMI for surgery loan"
    },
    { 
      id: "TRX-1003", 
      date: "2023-11-13 16:45", 
      patientId: "P45678", 
      patientName: "Aditya Verma",
      description: "Refund Processed", 
      type: "refund",
      amount: -1500, 
      status: "completed",
      paymentMethod: "Bank Transfer",
      reference: "REF-7654321",
      notes: "Partial refund for canceled tests"
    },
    { 
      id: "TRX-1004", 
      date: "2023-11-12 09:20", 
      patientId: "P98765", 
      patientName: "Neha Singh",
      description: "Loan Disbursement", 
      type: "loan",
      amount: 25000, 
      status: "completed",
      paymentMethod: "Direct Credit",
      reference: "LOAN-8765432",
      notes: "Maternity care package loan"
    },
    { 
      id: "TRX-1005", 
      date: "2023-11-11 13:10", 
      patientId: "P56789", 
      patientName: "Vikram Mehta",
      description: "Health Card Payment", 
      type: "payment",
      amount: 12000, 
      status: "completed",
      paymentMethod: "Health Card",
      reference: "HC-5678901",
      notes: "Emergency room charges"
    },
    { 
      id: "TRX-1006", 
      date: "2023-11-10 11:05", 
      patientId: "P34567", 
      patientName: "Ananya Joshi",
      description: "EMI Collection", 
      type: "emi",
      amount: 5000, 
      status: "completed",
      paymentMethod: "Auto Debit",
      reference: "EMI-2345678",
      notes: "Monthly EMI for cardiac procedure"
    },
    { 
      id: "TRX-1007", 
      date: "2023-11-09 15:30", 
      patientId: "P23456", 
      patientName: "Suresh Kumar",
      description: "Loan Disbursement", 
      type: "loan",
      amount: 18000, 
      status: "processing",
      paymentMethod: "Direct Credit",
      reference: "LOAN-3456789",
      notes: "Dental surgery loan"
    },
    { 
      id: "TRX-1008", 
      date: "2023-11-08 09:45", 
      patientId: "P67890", 
      patientName: "Meera Reddy",
      description: "Health Card Payment", 
      type: "payment",
      amount: 9500, 
      status: "completed",
      paymentMethod: "Health Card",
      reference: "HC-4567890",
      notes: "Regular health checkup and tests"
    },
    { 
      id: "TRX-1009", 
      date: "2023-11-07 14:20", 
      patientId: "P45678", 
      patientName: "Aditya Verma",
      description: "EMI Collection", 
      type: "emi",
      amount: 4000, 
      status: "failed",
      paymentMethod: "Auto Debit",
      reference: "EMI-3456789",
      notes: "Payment failed due to insufficient funds"
    },
    { 
      id: "TRX-1010", 
      date: "2023-11-06 10:30", 
      patientId: "P12345", 
      patientName: "Priya Patel",
      description: "Refund Processed", 
      type: "refund",
      amount: -2500, 
      status: "processing",
      paymentMethod: "Bank Transfer",
      reference: "REF-8765432",
      notes: "Refund for canceled appointment"
    },
  ];

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter(transaction => {
    // Apply search term filter
    const searchLower = searchTerm.toLowerCase();
    if (searchTerm && !transaction.id.toLowerCase().includes(searchLower) &&
        !transaction.patientId.toLowerCase().includes(searchLower) && 
        !transaction.patientName.toLowerCase().includes(searchLower) &&
        !transaction.description.toLowerCase().includes(searchLower)) {
      return false;
    }

    // Apply date filter (simplified - in a real app, use proper date filtering)
    if (dateFilter === "today" && !transaction.date.includes("2023-11-15")) {
      return false;
    }
    if (dateFilter === "week" && parseInt(transaction.date.split("-")[2]) < 9) {
      return false;
    }
    if (dateFilter === "month" && parseInt(transaction.date.split("-")[2]) < 1) {
      return false;
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

  const handleViewDetails = (transaction) => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and manage all financial transactions
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
                placeholder="Search by ID, patient or description..."
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
                          <SelectItem value="emi">EMI Collections</SelectItem>
                          <SelectItem value="loan">Loan Disbursements</SelectItem>
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
                          <SelectItem value="processing">Processing</SelectItem>
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
                  <TableHead>Patient</TableHead>
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
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.patientName}</div>
                        <div className="text-xs text-gray-500">{transaction.patientId}</div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${transaction.type === 'payment' ? 'bg-green-100 text-green-800' : ''}
                          ${transaction.type === 'refund' ? 'bg-amber-100 text-amber-800' : ''}
                          ${transaction.type === 'emi' ? 'bg-purple-100 text-purple-800' : ''}
                          ${transaction.type === 'loan' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {transaction.type}
                        </span>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                          ${transaction.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
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
                      No transactions found. Try adjusting your search or filters.
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
                Full details for transaction {selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                  <p className="text-sm font-mono">{selectedTransaction.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Date & Time</p>
                  <p className="text-sm">{selectedTransaction.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Patient ID</p>
                  <p className="text-sm">{selectedTransaction.patientId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Patient Name</p>
                  <p className="text-sm">{selectedTransaction.patientName}</p>
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
                    ${selectedTransaction.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${selectedTransaction.status === 'failed' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedTransaction.status}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className={`text-sm font-medium ${selectedTransaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{Math.abs(selectedTransaction.amount).toLocaleString()}
                  {selectedTransaction.amount < 0 ? ' (Refund)' : ''}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Payment Method</p>
                  <p className="text-sm">{selectedTransaction.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Reference Number</p>
                  <p className="text-sm font-mono">{selectedTransaction.reference}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <p className="text-sm">{selectedTransaction.notes}</p>
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
