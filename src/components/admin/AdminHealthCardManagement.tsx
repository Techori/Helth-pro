
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, FileEdit, Eye, AlertCircle, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { HealthCard, fetchAllHealthCards, approveHealthCard, rejectHealthCard } from "@/services/healthCardService";

const AdminHealthCardManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [healthCards, setHealthCards] = useState<HealthCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<HealthCard | null>(null);
  const [approvedCreditLimit, setApprovedCreditLimit] = useState<number>(0);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadHealthCards();
  }, []);

  const loadHealthCards = async () => {
    try {
      setLoading(true);
      const cards = await fetchAllHealthCards();
      setHealthCards(cards);
    } catch (error) {
      console.error('Failed to load health cards:', error);
      toast({
        title: "Error",
        description: "Failed to load health cards",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter cards based on search term
  const filteredCards = healthCards.filter(
    card => 
      card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.uhid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.employmentStatus?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (card: HealthCard) => {
    setSelectedCard(card);
    setApprovedCreditLimit(card.requestedCreditLimit || 25000);
    setApprovalDialogOpen(true);
  };

  const handleReject = async (card: HealthCard) => {
    const reason = prompt("Please enter rejection reason:");
    if (!reason) return;

    try {
      await rejectHealthCard(card._id, reason);
      toast({
        title: "Card Rejected",
        description: `Health card ${card.cardNumber} has been rejected`,
      });
      loadHealthCards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject health card",
        variant: "destructive",
      });
    }
  };

  const confirmApproval = async () => {
    if (!selectedCard) return;

    try {
      await approveHealthCard(selectedCard._id, approvedCreditLimit);
      toast({
        title: "Card Approved",
        description: `Health card ${selectedCard.cardNumber} has been approved with credit limit ₹${approvedCreditLimit.toLocaleString()}`,
      });
      setApprovalDialogOpen(false);
      setSelectedCard(null);
      loadHealthCards();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve health card",
        variant: "destructive",
      });
    }
  };

  const handleCardView = (cardId: string) => {
    toast({
      title: "Card Details",
      description: `Viewing details for card ${cardId}`,
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Download",
      description: "Health cards report is being generated and will download shortly.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'rejected':
        return 'bg-red-500';
      case 'expired':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getCardTypeColor = (cardType: string) => {
    switch (cardType) {
      case 'premium':
        return 'default';
      case 'ricare_discount':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading health cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Health Card Management</CardTitle>
              <CardDescription>Approve and manage all health card applications</CardDescription>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">{healthCards.length}</div>
                <div className="text-sm font-medium">Total Applications</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-green-500">
                  {healthCards.filter(card => card.status === "active").length}
                </div>
                <div className="text-sm font-medium">Active Cards</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-yellow-500">
                  {healthCards.filter(card => card.status === "pending").length}
                </div>
                <div className="text-sm font-medium">Pending Approval</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-amber-500">
                  ₹{healthCards.reduce((total, card) => total + (card.availableCredit || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm font-medium">Total Credit Issued</div>
              </div>
            </Card>
          </div>
          
          {filteredCards.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Card Number</TableHead>
                    <TableHead>UHID</TableHead>
                    <TableHead>Card Type</TableHead>
                    <TableHead>Requested Credit</TableHead>
                    <TableHead>Available Credit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCards.map((card) => (
                    <TableRow key={card._id}>
                      <TableCell className="font-medium">{card.cardNumber}</TableCell>
                      <TableCell>{card.uhid}</TableCell>
                      <TableCell>
                        <Badge variant={getCardTypeColor(card.cardType)}>
                          {card.cardType?.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>₹{(card.requestedCreditLimit || 0).toLocaleString()}</TableCell>
                      <TableCell>₹{card.availableCredit.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(card.status)}>
                          {card.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(card.issueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleCardView(card._id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {card.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleApprove(card)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleReject(card)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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
              Showing {filteredCards.length} of {healthCards.length} applications
            </p>
            <Button variant="outline" onClick={loadHealthCards}>Refresh</Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Health Card</DialogTitle>
            <DialogDescription>
              Set the approved credit limit for card {selectedCard?.cardNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="creditLimit" className="text-right">
                Credit Limit
              </Label>
              <Input
                id="creditLimit"
                type="number"
                value={approvedCreditLimit}
                onChange={(e) => setApprovedCreditLimit(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Requested</Label>
              <div className="col-span-3 text-sm text-muted-foreground">
                ₹{(selectedCard?.requestedCreditLimit || 0).toLocaleString()}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproval}>
              Approve Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminHealthCardManagement;
