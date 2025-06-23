import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock transaction data
const mockTransactions = [
  {
    id: "TRX-1001",
    date: "2023-11-15 14:30",
    user: "Rahul Sharma",
    type: "healthcard",
    description: "Health Card Payment",
    amount: 8500,
    status: "completed",
  },
  {
    id: "TRX-1002",
    date: "2023-11-14 10:15",
    user: "Priya Patel",
    type: "emi",
    description: "EMI Collection",
    amount: 3000,
    status: "completed",
  },
  {
    id: "TRX-1003",
    date: "2023-11-13 16:45",
    user: "Aditya Verma",
    type: "emi",
    description: "EMI Collection",
    amount: 5000,
    status: "pending",
  },
  {
    id: "TRX-1004",
    date: "2023-11-12 09:20",
    user: "Neha Singh",
    type: "healthcard",
    description: "Health Card Payment",
    amount: 12000,
    status: "completed",
  },
  {
    id: "TRX-1005",
    date: "2023-11-11 13:10",
    user: "Vikram Mehta",
    type: "emi",
    description: "EMI Collection",
    amount: 4000,
    status: "failed",
  },
];

type TransactionType = "all" | "healthcard" | "emi";

const AdminEMITransactions = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TransactionType>("all");
  const [filteredTransactions, setFilteredTransactions] = useState(mockTransactions);

  useEffect(() => {
    let filtered = mockTransactions;
    if (filter !== "all") {
      filtered = filtered.filter((t) => t.type === filter);
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(lower) ||
          t.user.toLowerCase().includes(lower) ||
          t.description.toLowerCase().includes(lower) ||
          t.status.toLowerCase().includes(lower)
      );
    }
    setFilteredTransactions(filtered);
  }, [search, filter]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>EMI & Health Card Transactions</CardTitle>
            <CardDescription>View and search all EMI and Health Card transactions</CardDescription>
          </div>
          <div className="flex items-center w-full md:w-[320px]">
            <Search className="w-4 h-4 mr-2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as TransactionType)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="healthcard">Health Card</TabsTrigger>
              <TabsTrigger value="emi">EMI</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.user}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${t.type === "healthcard" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}
                      `}>
                        {t.type === "healthcard" ? "Health Card" : "EMI"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      ₹{t.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${t.status === "completed" ? "bg-green-100 text-green-800" : ""}
                        ${t.status === "pending" ? "bg-blue-100 text-blue-800" : ""}
                        ${t.status === "failed" ? "bg-red-100 text-red-800" : ""}
                      `}>
                        {t.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminEMITransactions; 