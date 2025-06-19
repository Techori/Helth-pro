
import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Download, Upload, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WalletManagement = () => {
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Mock data - would come from API
  const hospitalWalletBalance = 45000;
  const financeWalletBalance = 125000;
  
  // Wallet transactions
  const walletTransactions = [
    { 
      id: "TRX-1001", 
      date: "2023-11-15 14:30", 
      patientId: "P78901", 
      description: "Health Card Payment", 
      amount: 8500, 
      walletType: "hospital",
      status: "Completed" 
    },
    { 
      id: "TRX-1002", 
      date: "2023-11-14 10:15", 
      patientId: "P12345", 
      description: "EMI Collection", 
      amount: 3000, 
      walletType: "finance",
      status: "Completed" 
    },
    { 
      id: "TRX-1003", 
      date: "2023-11-13 16:45", 
      patientId: "P45678", 
      description: "Refund Processed", 
      amount: -1500, 
      walletType: "hospital",
      status: "Completed" 
    },
    { 
      id: "TRX-1004", 
      date: "2023-11-12 09:20", 
      patientId: "P98765", 
      description: "Loan Disbursement", 
      amount: 25000, 
      walletType: "finance",
      status: "Completed" 
    },
    { 
      id: "TRX-1005", 
      date: "2023-11-11 13:10", 
      patientId: "P56789", 
      description: "Health Card Payment", 
      amount: 12000, 
      walletType: "hospital",
      status: "Completed" 
    },
    { 
      id: "TRX-1006", 
      date: "2023-11-10 11:05", 
      patientId: "P34567", 
      description: "EMI Collection", 
      amount: 5000, 
      walletType: "finance",
      status: "Completed" 
    },
    { 
      id: "TRX-1007", 
      date: "2023-11-09 15:30", 
      patientId: "P23456", 
      description: "Loan Disbursement", 
      amount: 18000, 
      walletType: "finance",
      status: "Completed" 
    },
    { 
      id: "TRX-1008", 
      date: "2023-11-08 09:45", 
      patientId: "P67890", 
      description: "Health Card Payment", 
      amount: 9500, 
      walletType: "hospital",
      status: "Completed" 
    },
    { 
      id: "TRX-1009", 
      date: "2023-11-07 14:20", 
      patientId: "P45678", 
      description: "EMI Collection", 
      amount: 4000, 
      walletType: "finance",
      status: "Completed" 
    },
    { 
      id: "TRX-1010", 
      date: "2023-11-06 10:30", 
      patientId: "P12345", 
      description: "Refund Processed", 
      amount: -2500, 
      walletType: "hospital",
      status: "Completed" 
    },
  ];

  // Filter transactions based on wallet type and period
  const getFilteredTransactions = (walletType) => {
    let filtered = walletTransactions.filter(tx => tx.walletType === walletType);
    
    // Apply date filter (in a real app, use proper date filtering)
    if (filterPeriod === "week") {
      // Last 7 days - simplified mock filter
      filtered = filtered.slice(0, 5);
    } else if (filterPeriod === "month") {
      // Last 30 days - simplified mock filter
      filtered = filtered.slice(0, 8);
    }
    
    return filtered;
  };

  const handleExportTransactions = (walletType) => {
    console.log(`Exporting ${walletType} transactions...`);
    // In a real app, this would generate and download a CSV/Excel file
    alert(`${walletType.charAt(0).toUpperCase() + walletType.slice(1)} transaction export started`);
  };

  return (
    <div className="space-y-6">
      {/* Wallet Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hospital Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hospital Wallet</CardTitle>
            <CardDescription>
              Manage Health Card payments and refunds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">₹{hospitalWalletBalance.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>12% from last month</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => handleExportTransactions('hospital')}>
              <Download className="h-4 w-4 mr-2" />
              Export Transaction History
            </Button>
          </CardFooter>
        </Card>

        {/* Finance Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle>Finance Wallet</CardTitle>
            <CardDescription>
              Track loan disbursements and EMI collections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold">₹{financeWalletBalance.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>8% from last month</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => handleExportTransactions('finance')}>
              <Download className="h-4 w-4 mr-2" />
              Export Transaction History
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Wallet Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Wallet Transaction History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardDescription>
              View all transactions across wallet types
            </CardDescription>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setFilterPeriod("all")} className={filterPeriod === "all" ? "bg-brand-50 text-brand-700" : ""}>
                All Time
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterPeriod("month")} className={filterPeriod === "month" ? "bg-brand-50 text-brand-700" : ""}>
                Month
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFilterPeriod("week")} className={filterPeriod === "week" ? "bg-brand-50 text-brand-700" : ""}>
                Week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Wallets</TabsTrigger>
                <TabsTrigger value="hospital">Hospital Wallet</TabsTrigger>
                <TabsTrigger value="finance">Finance Wallet</TabsTrigger>
              </TabsList>
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8 w-full md:w-[250px]"
                />
              </div>
            </div>

            {/* All Wallets Tab */}
            <TabsContent value="all">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Wallet Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {walletTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.patientId}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="capitalize">{transaction.walletType}</TableCell>
                        <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-600' : ''}`}>
                          ₹{Math.abs(transaction.amount).toLocaleString()}
                          {transaction.amount < 0 ? ' (Refund)' : ''}
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
              </div>
            </TabsContent>

            {/* Hospital Wallet Tab */}
            <TabsContent value="hospital">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTransactions('hospital').map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.patientId}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-600' : ''}`}>
                          ₹{Math.abs(transaction.amount).toLocaleString()}
                          {transaction.amount < 0 ? ' (Refund)' : ''}
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
              </div>
            </TabsContent>

            {/* Finance Wallet Tab */}
            <TabsContent value="finance">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Transaction ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getFilteredTransactions('finance').map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.patientId}</TableCell>
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;
