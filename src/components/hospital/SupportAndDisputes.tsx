
import { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  AlertTriangle,
  LifeBuoy,
  FileText
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  createdAt: string;
  updatedAt: string;
  description: string;
  patientId?: string;
  transactionId?: string;
}

interface DisputeTicket {
  id: string;
  subject: string;
  transactionId: string;
  amount: number;
  status: "Pending" | "Under Review" | "Resolved" | "Rejected";
  createdAt: string;
  updatedAt: string;
  reason: string;
}

const SupportAndDisputes = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("support");
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [isCreatingDispute, setIsCreatingDispute] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "Technical",
    priority: "Medium",
    description: "",
    patientId: "",
    transactionId: "",
  });

  const [newDispute, setNewDispute] = useState({
    subject: "",
    transactionId: "",
    amount: "",
    reason: "",
  });

  // Mock support tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: "TKT-1001",
      subject: "Health Card Payment Issue",
      category: "Payment",
      status: "Open",
      priority: "High",
      createdAt: "19 Nov 2023",
      updatedAt: "19 Nov 2023",
      description: "Patient's health card payment is showing as declined even though the balance is sufficient.",
      patientId: "P12345",
      transactionId: "TRX-78901"
    },
    {
      id: "TKT-1002",
      subject: "Login Problems",
      category: "Technical",
      status: "In Progress",
      priority: "Medium",
      createdAt: "18 Nov 2023",
      updatedAt: "19 Nov 2023",
      description: "Unable to login to the dashboard from certain computers."
    },
    {
      id: "TKT-1003",
      subject: "Loan Application Not Processing",
      category: "Loan",
      status: "Resolved",
      priority: "High",
      createdAt: "15 Nov 2023",
      updatedAt: "18 Nov 2023",
      description: "Patient loan application LN-1005 has been stuck in pending status for 3 days.",
      transactionId: "LN-1005"
    }
  ]);

  // Mock dispute tickets
  const [disputeTickets, setDisputeTickets] = useState<DisputeTicket[]>([
    {
      id: "DSP-1001",
      subject: "Incorrect Amount Charged",
      transactionId: "TRX-78901",
      amount: 5000,
      status: "Pending",
      createdAt: "19 Nov 2023",
      updatedAt: "19 Nov 2023",
      reason: "The amount charged was ₹5,000 more than the actual treatment cost."
    },
    {
      id: "DSP-1002",
      subject: "Duplicate Transaction",
      transactionId: "TRX-78902",
      amount: 12000,
      status: "Under Review",
      createdAt: "17 Nov 2023",
      updatedAt: "19 Nov 2023",
      reason: "Patient was charged twice for the same treatment. Requesting refund for the duplicate transaction."
    },
    {
      id: "DSP-1003",
      subject: "Service Not Provided",
      transactionId: "TRX-78903",
      amount: 8500,
      status: "Resolved",
      createdAt: "15 Nov 2023",
      updatedAt: "18 Nov 2023",
      reason: "Patient was charged for a service that was not actually provided. The amount has been refunded."
    }
  ]);

  const filteredSupportTickets = supportTickets.filter(ticket => 
    ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ticket.patientId && ticket.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (ticket.transactionId && ticket.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDisputeTickets = disputeTickets.filter(dispute => 
    dispute.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dispute.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSupportTicket = () => {
    // Basic validation
    if (!newTicket.subject || !newTicket.description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    const ticket: SupportTicket = {
      id: `TKT-${1000 + supportTickets.length + 1}`,
      subject: newTicket.subject,
      category: newTicket.category,
      status: "Open",
      priority: newTicket.priority as "Low" | "Medium" | "High" | "Urgent",
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: newTicket.description,
      patientId: newTicket.patientId || undefined,
      transactionId: newTicket.transactionId || undefined,
    };

    setSupportTickets([ticket, ...supportTickets]);
    setIsCreatingTicket(false);
    setNewTicket({
      subject: "",
      category: "Technical",
      priority: "Medium",
      description: "",
      patientId: "",
      transactionId: "",
    });

    toast({
      title: "Support Ticket Created",
      description: `Ticket ${ticket.id} has been submitted successfully.`,
    });
  };

  const handleCreateDispute = () => {
    // Basic validation
    if (!newDispute.subject || !newDispute.transactionId || !newDispute.amount || !newDispute.reason) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all required fields.",
      });
      return;
    }

    const dispute: DisputeTicket = {
      id: `DSP-${1000 + disputeTickets.length + 1}`,
      subject: newDispute.subject,
      transactionId: newDispute.transactionId,
      amount: parseFloat(newDispute.amount) || 0,
      status: "Pending",
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      updatedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      reason: newDispute.reason,
    };

    setDisputeTickets([dispute, ...disputeTickets]);
    setIsCreatingDispute(false);
    setNewDispute({
      subject: "",
      transactionId: "",
      amount: "",
      reason: "",
    });

    toast({
      title: "Dispute Ticket Created",
      description: `Dispute ${dispute.id} has been submitted successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="support">Support Tickets</TabsTrigger>
          <TabsTrigger value="disputes">Payment Disputes</TabsTrigger>
        </TabsList>
        
        {/* Support Tickets */}
        <TabsContent value="support">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  Create and manage support requests
                </CardDescription>
              </div>
              <Dialog open={isCreatingTicket} onOpenChange={setIsCreatingTicket}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Ticket</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create Support Ticket</DialogTitle>
                    <DialogDescription>
                      Fill in the details to submit a new support ticket.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="subject">Subject*</Label>
                      <Input
                        id="subject"
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                        placeholder="Brief description of the issue"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={newTicket.category}
                          onValueChange={(value) => setNewTicket({...newTicket, category: value})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technical">Technical Issue</SelectItem>
                            <SelectItem value="Payment">Payment Problem</SelectItem>
                            <SelectItem value="Loan">Loan Processing</SelectItem>
                            <SelectItem value="Health Card">Health Card</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select 
                          value={newTicket.priority}
                          onValueChange={(value) => setNewTicket({...newTicket, priority: value})}
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description*</Label>
                      <Textarea
                        id="description"
                        value={newTicket.description}
                        onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                        placeholder="Detailed description of the issue"
                        className="h-24"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="patientId">Patient ID (if applicable)</Label>
                        <Input
                          id="patientId"
                          value={newTicket.patientId}
                          onChange={(e) => setNewTicket({...newTicket, patientId: e.target.value})}
                          placeholder="Patient ID"
                        />
                      </div>
                      <div>
                        <Label htmlFor="transactionId">Transaction/Loan ID (if applicable)</Label>
                        <Input
                          id="transactionId"
                          value={newTicket.transactionId}
                          onChange={(e) => setNewTicket({...newTicket, transactionId: e.target.value})}
                          placeholder="Transaction ID"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingTicket(false)}>Cancel</Button>
                    <Button onClick={handleCreateSupportTicket}>Submit Ticket</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tickets by ID, subject, patient ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Tickets table */}
              {filteredSupportTickets.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSupportTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.subject}</TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>{ticket.createdAt}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 
                              ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              ticket.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              ticket.priority === 'Low' ? 'bg-gray-100 text-gray-800' : 
                              ticket.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                              ticket.priority === 'High' ? 'bg-orange-100 text-orange-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {ticket.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              <span>View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">
                    No support tickets found. Try a different search term or create a new ticket.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions and answers about the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I process a health card payment?</AccordionTrigger>
                  <AccordionContent>
                    To process a health card payment, navigate to the "Process Payment" tab, search for the patient by name or health card ID, enter the payment amount, and click "Process Payment". The system will automatically deduct the amount from the patient's health card if sufficient balance is available.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What if a patient doesn't have enough balance in their health card?</AccordionTrigger>
                  <AccordionContent>
                    If a patient doesn't have enough balance, you can apply for a patient loan through the "Loan Applications" tab. Fill in the required details and submit the application. Once approved by RI Medicare, the funds will be added to the patient's health card for treatment.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How long does it take for loan approval?</AccordionTrigger>
                  <AccordionContent>
                    Loan applications are typically processed within 24-48 hours. For urgent cases, you can mark the loan as "Urgent" and contact support to expedite the process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I withdraw funds from my hospital wallet?</AccordionTrigger>
                  <AccordionContent>
                    To withdraw funds, go to the "Wallet Management" tab and click on "Request Withdrawal". Enter the amount you wish to withdraw and the bank account details. Withdrawals are processed within 2-3 business days.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>What is the platform fee charged for transactions?</AccordionTrigger>
                  <AccordionContent>
                    RI Medicare charges a platform fee of 2% on all health card transactions and 1.5% on loan disbursements. These fees are automatically deducted from the hospital wallet and are reflected in the transaction history.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <LifeBuoy className="h-4 w-4 mr-2" />
                <span>Need additional help? Contact our support team</span>
              </div>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                <span>User Guide</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Payment Disputes */}
        <TabsContent value="disputes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Payment Disputes</CardTitle>
                <CardDescription>
                  Raise and track payment dispute requests
                </CardDescription>
              </div>
              <Dialog open={isCreatingDispute} onOpenChange={setIsCreatingDispute}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Raise Dispute</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Raise Payment Dispute</DialogTitle>
                    <DialogDescription>
                      Fill in the details to submit a payment dispute request.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div>
                      <Label htmlFor="dispute-subject">Subject*</Label>
                      <Input
                        id="dispute-subject"
                        value={newDispute.subject}
                        onChange={(e) => setNewDispute({...newDispute, subject: e.target.value})}
                        placeholder="Brief description of the dispute"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="transaction-id">Transaction ID*</Label>
                      <Input
                        id="transaction-id"
                        value={newDispute.transactionId}
                        onChange={(e) => setNewDispute({...newDispute, transactionId: e.target.value})}
                        placeholder="Transaction ID (format: TRX-XXXXX)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Disputed Amount (₹)*</Label>
                      <Input
                        id="amount"
                        value={newDispute.amount}
                        onChange={(e) => setNewDispute({...newDispute, amount: e.target.value})}
                        placeholder="Amount in dispute"
                        type="number"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="reason">Reason for Dispute*</Label>
                      <Textarea
                        id="reason"
                        value={newDispute.reason}
                        onChange={(e) => setNewDispute({...newDispute, reason: e.target.value})}
                        placeholder="Detailed explanation of the payment dispute"
                        className="h-24"
                      />
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-md text-sm border border-yellow-100">
                      <p className="font-medium text-yellow-800 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Important Note:
                      </p>
                      <p className="mt-1 text-yellow-700">
                        Please ensure you have verified all transaction details before raising a dispute. 
                        Disputes are reviewed by the RI Medicare team and may take 3-5 business days to resolve.
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingDispute(false)}>Cancel</Button>
                    <Button onClick={handleCreateDispute}>Submit Dispute</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search disputes by ID, subject, transaction ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Disputes table */}
              {filteredDisputeTickets.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dispute ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDisputeTickets.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-medium">{dispute.id}</TableCell>
                          <TableCell>{dispute.subject}</TableCell>
                          <TableCell className="font-mono text-xs">{dispute.transactionId}</TableCell>
                          <TableCell>₹{dispute.amount.toLocaleString()}</TableCell>
                          <TableCell>{dispute.createdAt}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dispute.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              dispute.status === 'Under Review' ? 'bg-blue-100 text-blue-800' : 
                              dispute.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {dispute.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8"
                            >
                              <Search className="h-4 w-4 mr-2" />
                              <span>Details</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md">
                  <p className="text-muted-foreground">
                    No dispute tickets found. Try a different search term or create a new dispute.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportAndDisputes;
