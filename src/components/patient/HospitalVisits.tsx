
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Calendar, CreditCard, Receipt } from "lucide-react";
import { fetchUserTransactions, Transaction } from "@/services/transactionService";
import { useToast } from "@/hooks/use-toast";

const HospitalVisits = () => {
  const { toast } = useToast();
  const [visits, setVisits] = useState<Transaction[]>([]);
  const [filteredVisits, setFilteredVisits] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitHistory = async () => {
      try {
        const transactions = await fetchUserTransactions();
        // Filter only payment transactions which represent hospital visits
        const visitRecords = transactions.filter(t => t.type === 'payment');
        setVisits(visitRecords);
        setFilteredVisits(visitRecords);
      } catch (error) {
        console.error('Error fetching visit history:', error);
        toast({
          title: "Error",
          description: "Failed to fetch visit history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVisitHistory();
  }, [toast]);

  useEffect(() => {
    const filtered = visits.filter(visit =>
      visit.hospital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visit.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVisits(filtered);
  }, [searchTerm, visits]);

  const getStatusColor = (status: string) => {
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

  const totalVisits = visits.length;
  const totalSpent = visits.reduce((sum, visit) => sum + visit.amount, 0);
  const thisMonthVisits = visits.filter(visit => {
    const visitDate = new Date(visit.date);
    const now = new Date();
    return visitDate.getMonth() === now.getMonth() && visitDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading visit history...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
            <p className="text-xs text-gray-500 mt-3">
              All time hospital visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-3">
              Via health card payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Receipt className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthVisits}</div>
            <p className="text-xs text-gray-500 mt-3">
              Visits this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visit History */}
      <Card>
        <CardHeader>
          <CardTitle>Hospital Visit History</CardTitle>
          <CardDescription>
            Track your health card payments and hospital visits
          </CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by hospital name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVisits.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Service/Treatment</TableHead>
                  <TableHead className="text-right">Amount Paid</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.map((visit) => (
                  <TableRow key={visit._id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {new Date(visit.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {visit.hospital || 'Healthcare Provider'}
                      </div>
                    </TableCell>
                    <TableCell>{visit.description}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{visit.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visit history found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No visits match your search criteria.' : 'Your hospital visits and health card payments will appear here.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalVisits;
