
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, User, FileText, Wallet, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const HealthCardManagement = () => {
  const [activeTab, setActiveTab] = useState("cards");

  // Mock function for adding a card
  const handleAddCard = () => {
    toast({
      title: "Card Added Successfully",
      description: "New health card has been issued to the patient",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Health Card Management</CardTitle>
              <CardDescription>Manage health cards for your patients</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Issue New Health Card</DialogTitle>
                    <DialogDescription>
                      Fill in the patient details to issue a new health card.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="patient-id" className="text-right">
                        Patient ID
                      </Label>
                      <Input
                        id="patient-id"
                        placeholder="Enter patient ID"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="card-type" className="text-right">
                        Card Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select card type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="validity" className="text-right">
                        Validity
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select validity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Months</SelectItem>
                          <SelectItem value="12">1 Year</SelectItem>
                          <SelectItem value="24">2 Years</SelectItem>
                          <SelectItem value="36">3 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddCard}>Issue Card</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="flex items-center gap-1">
                <Search className="h-4 w-4" /> Find Card
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cards" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="cards">
                <CreditCard className="mr-2 h-4 w-4" /> 
                All Cards
              </TabsTrigger>
              <TabsTrigger value="patients">
                <User className="mr-2 h-4 w-4" /> 
                Patient Cards
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <FileText className="mr-2 h-4 w-4" /> 
                Card Transactions
              </TabsTrigger>
              <TabsTrigger value="deductions">
                <Wallet className="mr-2 h-4 w-4" /> 
                Card Deductions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cards">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>RIMC-10012</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>Gold</TableCell>
                      <TableCell>01/01/2025</TableCell>
                      <TableCell>31/12/2025</TableCell>
                      <TableCell>₹48,500</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>RIMC-10015</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>Platinum</TableCell>
                      <TableCell>15/01/2025</TableCell>
                      <TableCell>14/01/2026</TableCell>
                      <TableCell>₹94,200</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>RIMC-10018</TableCell>
                      <TableCell>Amit Kumar</TableCell>
                      <TableCell>Silver</TableCell>
                      <TableCell>02/02/2025</TableCell>
                      <TableCell>01/02/2026</TableCell>
                      <TableCell>₹22,800</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="patients">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Cards Issued</TableHead>
                      <TableHead>Active Cards</TableHead>
                      <TableHead>Total Balance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>RI-P10045</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>₹48,500</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Cards</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>RI-P10046</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>₹94,200</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Cards</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>RI-P10047</TableCell>
                      <TableCell>Amit Kumar</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>₹22,800</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Cards</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>TXN-45678</TableCell>
                      <TableCell>RIMC-10012</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>03/04/2025</TableCell>
                      <TableCell>₹1,500</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TXN-45680</TableCell>
                      <TableCell>RIMC-10015</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>02/04/2025</TableCell>
                      <TableCell>₹5,800</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>TXN-45682</TableCell>
                      <TableCell>RIMC-10018</TableCell>
                      <TableCell>Amit Kumar</TableCell>
                      <TableCell>01/04/2025</TableCell>
                      <TableCell>₹2,200</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="deductions">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deduction ID</TableHead>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>DED-12345</TableCell>
                      <TableCell>RIMC-10012</TableCell>
                      <TableCell>Rahul Sharma</TableCell>
                      <TableCell>04/04/2025</TableCell>
                      <TableCell>₹1,500</TableCell>
                      <TableCell>Laboratory Tests</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Processed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DED-12347</TableCell>
                      <TableCell>RIMC-10015</TableCell>
                      <TableCell>Priya Patel</TableCell>
                      <TableCell>03/04/2025</TableCell>
                      <TableCell>₹5,800</TableCell>
                      <TableCell>MRI Scan</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Processed</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DED-12348</TableCell>
                      <TableCell>RIMC-10018</TableCell>
                      <TableCell>Amit Kumar</TableCell>
                      <TableCell>02/04/2025</TableCell>
                      <TableCell>₹2,200</TableCell>
                      <TableCell>Consultation</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Processed</Badge>
                      </TableCell>
                    </TableRow>
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

export default HealthCardManagement;
