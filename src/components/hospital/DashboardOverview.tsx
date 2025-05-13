
import { ArrowUpRight, ArrowDownRight, CreditCard, Calendar, Wallet, BanknoteIcon } from "lucide-react";
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
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip } from "recharts";

const DashboardOverview = () => {
  // Mock data - would come from API in real implementation
  const walletData = {
    hospitalWallet: 45000,
    financeWallet: 125000,
    totalPatients: 580,
    activeLoans: 32
  };

  const recentTransactions = [
    { id: "TX123456", date: "2023-11-15", patientId: "P78901", description: "Health Card Payment", amount: 8500, status: "Completed" },
    { id: "TX123457", date: "2023-11-14", patientId: "P12345", description: "EMI Collected", amount: 3000, status: "Completed" },
    { id: "TX123458", date: "2023-11-13", patientId: "P45678", description: "Refund Processed", amount: -1500, status: "Completed" },
    { id: "TX123459", date: "2023-11-12", patientId: "P98765", description: "Loan Disbursement", amount: 25000, status: "Completed" },
    { id: "TX123460", date: "2023-11-11", patientId: "P56789", description: "Health Card Payment", amount: 12000, status: "Completed" },
  ];
  
  // Monthly transaction data for charts
  const monthlyData = [
    { month: "Jan", transactions: 45, amount: 180000 },
    { month: "Feb", transactions: 52, amount: 220000 },
    { month: "Mar", transactions: 48, amount: 190000 },
    { month: "Apr", transactions: 61, amount: 240000 },
    { month: "May", transactions: 55, amount: 210000 },
    { month: "Jun", transactions: 67, amount: 270000 },
    { month: "Jul", transactions: 70, amount: 290000 },
    { month: "Aug", transactions: 62, amount: 250000 },
    { month: "Sep", transactions: 75, amount: 320000 },
    { month: "Oct", transactions: 80, amount: 350000 },
    { month: "Nov", transactions: 85, amount: 370000 },
  ];

  const chartConfig = {
    transactions: {
      label: "Transactions",
      theme: {
        light: "#4f46e5",
        dark: "#6366f1"  // Added dark theme color
      },
    },
    amount: {
      label: "Amount (₹)",
      theme: {
        light: "#16a34a",
        dark: "#22c55e"  // Added dark theme color
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Hospital Wallet Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hospital Wallet</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{walletData.hospitalWallet.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>12% from last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Health Card payments received
            </p>
          </CardContent>
        </Card>

        {/* Finance Wallet Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Finance Wallet</CardTitle>
            <BanknoteIcon className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{walletData.financeWallet.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>8% from last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Loan disbursements and EMI collections
            </p>
          </CardContent>
        </Card>

        {/* Total Patients Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.totalPatients}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>18% from last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Health Card linked patients
            </p>
          </CardContent>
        </Card>

        {/* Active Loans Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.activeLoans}</div>
            <div className="flex items-center pt-1 text-xs text-red-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              <span>3% from last month</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Loans with pending EMIs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Transactions Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Transactions</CardTitle>
            <CardDescription>
              Number of transactions processed each month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="transactions" name="transactions" fill="var(--color-transactions)" radius={[4, 4, 0, 0]} />
                    <ChartTooltip>
                      <ChartTooltipContent />
                    </ChartTooltip>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer config={chartConfig}>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Amount Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Amount</CardTitle>
            <CardDescription>
              Total transaction value each month (in ₹)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-80">
                <ResponsiveContainer>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="amount" name="amount" stroke="var(--color-amount)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartContainer config={chartConfig}>
                <ChartLegend>
                  <ChartLegendContent />
                </ChartLegend>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest 5 transactions processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Patient ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
