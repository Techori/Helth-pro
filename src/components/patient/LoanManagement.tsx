
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Calendar, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const LoanManagement = () => {
  // Mock data
  const loanDetails = {
    loanId: "LOAN-123456",
    totalLoanAmount: 50000,
    remainingBalance: 35000,
    interestRate: "12%",
    loanTerm: "24 months",
    emiAmount: 2500,
    nextPaymentDue: "15/12/2023",
    startDate: "15/01/2023",
    endDate: "15/12/2024",
  };

  const emiHistory = [
    { 
      emiNumber: 11, 
      dueDate: "15/11/2023", 
      amount: 2500, 
      principal: 1800, 
      interest: 700, 
      status: "Paid", 
      paymentDate: "14/11/2023" 
    },
    { 
      emiNumber: 10, 
      dueDate: "15/10/2023", 
      amount: 2500, 
      principal: 1780, 
      interest: 720, 
      status: "Paid", 
      paymentDate: "15/10/2023" 
    },
    { 
      emiNumber: 9, 
      dueDate: "15/09/2023", 
      amount: 2500, 
      principal: 1760, 
      interest: 740, 
      status: "Paid", 
      paymentDate: "13/09/2023" 
    },
    { 
      emiNumber: 8, 
      dueDate: "15/08/2023", 
      amount: 2500, 
      principal: 1740, 
      interest: 760, 
      status: "Paid", 
      paymentDate: "15/08/2023" 
    },
  ];

  const handlePayEMI = () => {
    toast({
      title: "EMI Payment",
      description: "Redirecting to payment gateway for your EMI payment.",
    });
  };

  const handlePrepayLoan = () => {
    toast({
      title: "Prepay Loan",
      description: "You can save on interest by prepaying your loan. Calculating prepayment amount...",
    });
  };

  const handleDownloadStatement = () => {
    toast({
      title: "Loan Statement",
      description: "Your loan statement is being downloaded.",
    });
  };

  const handleSetReminder = () => {
    toast({
      title: "Payment Reminder",
      description: "We'll remind you 3 days before your EMI due date.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Loan Details</CardTitle>
              <CardDescription>Your active medical loan</CardDescription>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Loan Amount</p>
              <p className="text-2xl font-bold">₹{loanDetails.totalLoanAmount.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Remaining Balance</p>
              <p className="text-2xl font-bold">₹{loanDetails.remainingBalance.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold">₹{loanDetails.emiAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Loan ID</p>
              <p className="font-medium">{loanDetails.loanId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interest Rate</p>
              <p className="font-medium">{loanDetails.interestRate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Term</p>
              <p className="font-medium">{loanDetails.loanTerm}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Next Payment Due</p>
              <p className="font-medium text-amber-600">{loanDetails.nextPaymentDue}</p>
            </div>
          </div>
          
          <div className="relative pt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${((loanDetails.totalLoanAmount - loanDetails.remainingBalance) / loanDetails.totalLoanAmount) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              You've paid {Math.round(((loanDetails.totalLoanAmount - loanDetails.remainingBalance) / loanDetails.totalLoanAmount) * 100)}% of your total loan amount
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button onClick={handlePayEMI}>Pay EMI Now</Button>
          <Button variant="outline" onClick={handlePrepayLoan}>Prepay Loan</Button>
          <Button variant="outline" onClick={handleDownloadStatement}>
            <Download className="mr-2 h-4 w-4" />
            Loan Statement
          </Button>
          <Button variant="outline" onClick={handleSetReminder}>
            <Bell className="mr-2 h-4 w-4" />
            Set Reminder
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>EMI Payment History</CardTitle>
          <CardDescription>View your past EMI payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>EMI #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {emiHistory.map((emi) => (
                <TableRow key={emi.emiNumber}>
                  <TableCell>{emi.emiNumber}</TableCell>
                  <TableCell>{emi.dueDate}</TableCell>
                  <TableCell>₹{emi.amount.toLocaleString()}</TableCell>
                  <TableCell>₹{emi.principal.toLocaleString()}</TableCell>
                  <TableCell>₹{emi.interest.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {emi.status}
                    </span>
                  </TableCell>
                  <TableCell>{emi.paymentDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">View Complete History</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoanManagement;
