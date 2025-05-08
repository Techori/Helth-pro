
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, CreditCard, Calendar, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PatientDashboardOverview = () => {
  // Mock data - would come from API in real implementation
  const healthCardData = {
    cardNumber: "HC-78901-23456",
    availableCredit: 25000,
    usedCredit: 15000,
    lastTransaction: "2023-11-20",
    expiryDate: "2026-12-31",
  };

  const loanData = {
    activeLoan: true,
    totalLoanAmount: 50000,
    remainingBalance: 35000,
    nextPaymentDue: "2023-12-15",
    nextPaymentAmount: 2500,
    loanTerm: "24 months",
    interestRate: "12%",
  };

  const recentTransactions = [
    { id: "TX123456", date: "2023-11-20", hospital: "City General Hospital", description: "Consultation Fee", amount: 2500, status: "Completed" },
    { id: "TX123457", date: "2023-11-15", hospital: "Medicare Pharmacy", description: "Prescription Meds", amount: 1800, status: "Completed" },
    { id: "TX123458", date: "2023-11-10", hospital: "City General Hospital", description: "Lab Tests", amount: 3500, status: "Completed" },
    { id: "TX123459", date: "2023-11-05", hospital: "Wellness Clinic", description: "Physiotherapy", amount: 1200, status: "Completed" },
  ];

  const upcomingAppointments = [
    { id: "AP123", date: "2023-12-10", time: "10:30 AM", doctor: "Dr. Sarah Johnson", hospital: "City General Hospital", department: "Cardiology" },
    { id: "AP124", date: "2023-12-18", time: "2:00 PM", doctor: "Dr. Robert Smith", hospital: "Wellness Clinic", department: "Orthopedics" },
  ];

  // Calculate totals
  const totalCredit = healthCardData.availableCredit + healthCardData.usedCredit;
  const creditUsedPercentage = (healthCardData.usedCredit / totalCredit) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Health Card Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Card</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{healthCardData.availableCredit.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <span>Available Credit</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Card: {healthCardData.cardNumber}
            </p>
          </CardContent>
        </Card>

        {/* Loan Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loan</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{loanData.remainingBalance.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-blue-600">
              <span>Remaining Balance</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Next Payment: ₹{loanData.nextPaymentAmount.toLocaleString()} on {loanData.nextPaymentDue}
            </p>
          </CardContent>
        </Card>

        {/* Health Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Activity</CardTitle>
            <Activity className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <div className="flex items-center pt-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>Recent Medical Visits</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Last Visit: Nov 20, 2023
            </p>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <div className="flex items-center pt-1 text-xs text-blue-600">
              <span>Upcoming Appointments</span>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Next: {upcomingAppointments[0]?.date}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your recent health card transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hospital/Vendor</TableHead>
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
                  <TableCell>{transaction.hospital}</TableCell>
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
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Your scheduled medical appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.id}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.hospital}</TableCell>
                  <TableCell>{appointment.department}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDashboardOverview;
