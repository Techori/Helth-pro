
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, FileEdit, Eye, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const AdminHealthCardManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for health cards
  const healthCards = [
    {
      id: "HC-12345",
      patientName: "Rahul Sharma",
      patientId: "PAT-23456",
      cardType: "Gold",
      creditLimit: 50000,
      currentBalance: 0,
      expiryDate: "10/25",
      status: "Active",
      hospital: "City General Hospital"
    },
    {
      id: "HC-12346",
      patientName: "Priya Patel",
      patientId: "PAT-23457",
      cardType: "Silver",
      creditLimit: 30000,
      currentBalance: 5000,
      expiryDate: "08/25",
      status: "Active",
      hospital: "Medicare Clinic"
    },
    {
      id: "HC-12347",
      patientName: "Sameer Khan",
      patientId: "PAT-23458",
      cardType: "Platinum",
      creditLimit: 100000,
      currentBalance: 25000,
      expiryDate: "11/25",
      status: "Active",
      hospital: "LifeCare Hospital"
    },
    {
      id: "HC-12348",
      patientName: "Aisha Reddy",
      patientId: "PAT-23459",
      cardType: "Gold",
      creditLimit: 50000,
      currentBalance: 12000,
      expiryDate: "09/25",
      status: "Pending",
      hospital: "City General Hospital"
    }
  ];

  // Filter cards based on search term
  const filteredCards = healthCards.filter(
    card => 
      card.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardView = (cardId: string) => {
    toast({
      title: "Card Details",
      description: `Viewing details for card ${cardId}`,
    });
  };

  const handleCardEdit = (cardId: string) => {
    toast({
      title: "Edit Card",
      description: `Editing card ${cardId}`,
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Download",
      description: "Health cards report is being generated and will download shortly.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Health Card Management</CardTitle>
              <CardDescription>Manage and monitor all health cards in the system</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="search"
                placeholder="Search health cards..."
                className="max-w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" onClick={handleDownloadReport}>
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">{healthCards.length}</div>
                <div className="text-sm font-medium">Total Cards</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-500">
                  {healthCards.filter(card => card.status === "Active").length}
                </div>
                <div className="text-sm font-medium">Active Cards</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-amber-500">
                  ₹{healthCards.reduce((total, card) => total + card.currentBalance, 0).toLocaleString()}
                </div>
                <div className="text-sm font-medium">Total Outstanding</div>
              </div>
            </Card>
          </div>
          
          {filteredCards.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card ID</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Card Type</TableHead>
                    <TableHead>Credit Limit</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card.id}>
                      <TableCell className="font-medium">{card.id}</TableCell>
                      <TableCell>{card.patientName}</TableCell>
                      <TableCell>{card.hospital}</TableCell>
                      <TableCell>
                        <Badge variant={
                          card.cardType === "Platinum" ? "default" : 
                          card.cardType === "Gold" ? "secondary" : 
                          "outline"
                        }>
                          {card.cardType}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{card.creditLimit.toLocaleString()}</TableCell>
                      <TableCell>₹{card.currentBalance.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={card.status === "Active" ? "default" : "secondary"} className={card.status === "Active" ? "bg-green-500" : "bg-amber-500"}>
                          {card.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleCardView(card.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleCardEdit(card.id)}>
                            <FileEdit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <p className="text-muted-foreground">No health cards found</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCards.length} of {healthCards.length} cards
            </p>
            <Button variant="outline">View All Cards</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminHealthCardManagement;
