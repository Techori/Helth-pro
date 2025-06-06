import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Edit, FileText, Percent, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CommissionStructure = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("health-card");
  const [isAddingCommission, setIsAddingCommission] = useState(false);
  const [newCommission, setNewCommission] = useState({
    tier: "",
    minSales: "",
    maxSales: "",
    commissionPercent: "",
    bonusAmount: "",
    status: "Active"
  });

  // Mock data for commission structures
  const healthCardCommission = [
    {
      id: "HC-001",
      tier: "Standard",
      minSales: 0,
      maxSales: 50,
      commissionPercent: 2,
      bonusAmount: 0,
      status: "Active"
    },
    {
      id: "HC-002",
      tier: "Bronze",
      minSales: 51,
      maxSales: 100,
      commissionPercent: 3,
      bonusAmount: 2000,
      status: "Active"
    },
    {
      id: "HC-003",
      tier: "Silver",
      minSales: 101,
      maxSales: 200,
      commissionPercent: 4,
      bonusAmount: 5000,
      status: "Active"
    },
    {
      id: "HC-004",
      tier: "Gold",
      minSales: 201,
      maxSales: 300,
      commissionPercent: 5,
      bonusAmount: 10000,
      status: "Active"
    },
    {
      id: "HC-005",
      tier: "Platinum",
      minSales: 301,
      maxSales: null,
      commissionPercent: 6,
      bonusAmount: 15000,
      status: "Active"
    }
  ];

  const loanCommission = [
    {
      id: "LN-001",
      tier: "Standard",
      minAmount: 0,
      maxAmount: 1000000,
      commissionPercent: 0.5,
      bonusAmount: 0,
      status: "Active"
    },
    {
      id: "LN-002",
      tier: "Bronze",
      minAmount: 1000001,
      maxAmount: 3000000,
      commissionPercent: 0.8,
      bonusAmount: 5000,
      status: "Active"
    },
    {
      id: "LN-003",
      tier: "Silver",
      minAmount: 3000001,
      maxAmount: 5000000,
      commissionPercent: 1,
      bonusAmount: 10000,
      status: "Active"
    },
    {
      id: "LN-004",
      tier: "Gold",
      minAmount: 5000001,
      maxAmount: 10000000,
      commissionPercent: 1.2,
      bonusAmount: 25000,
      status: "Active"
    },
    {
      id: "LN-005",
      tier: "Platinum",
      minAmount: 10000001,
      maxAmount: null,
      commissionPercent: 1.5,
      bonusAmount: 50000,
      status: "Active"
    }
  ];

  const bonusStructure = [
    {
      id: "BN-001",
      name: "Quarterly Target Achievement",
      description: "Bonus for achieving quarterly target",
      amount: 10000,
      criteria: "100% target achievement",
      applicableTo: "All Sales Staff",
      status: "Active"
    },
    {
      id: "BN-002",
      name: "Team Performance Bonus",
      description: "Bonus for team exceeding targets",
      amount: 25000,
      criteria: "Team exceeds target by 20%",
      applicableTo: "Team Managers",
      status: "Active"
    },
    {
      id: "BN-003",
      name: "Elite Sales Club",
      description: "Recognition bonus for top performers",
      amount: 50000,
      criteria: "Top 5 sales performers annually",
      applicableTo: "Sales Representatives",
      status: "Active"
    },
    {
      id: "BN-004",
      name: "New Hospital Onboarding",
      description: "Bonus for onboarding new hospital partners",
      amount: 15000,
      criteria: "Per new hospital partner",
      applicableTo: "Relationship Managers",
      status: "Active"
    }
  ];

  const handleEditCommission = (id: string) => {
    toast({
      title: "Edit Commission Structure",
      description: `Editing commission structure with ID: ${id}`,
    });
  };

  const handleAddCommission = () => {
    // Validate form data
    if (!newCommission.tier || !newCommission.minSales || !newCommission.commissionPercent) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Generate a new commission ID
    const newCommissionId = `HC-${String(healthCardCommission.length + 1).padStart(3, '0')}`;

    // Create new commission object
    const commissionToAdd = {
      id: newCommissionId,
      tier: newCommission.tier,
      minSales: Number(newCommission.minSales),
      maxSales: newCommission.maxSales ? Number(newCommission.maxSales) : null,
      commissionPercent: Number(newCommission.commissionPercent),
      bonusAmount: Number(newCommission.bonusAmount) || 0,
      status: newCommission.status
    };

    // Add commission to the list
    setHealthCardCommission(prevCommissions => [...prevCommissions, commissionToAdd]);

    // Reset form and close dialog
    setNewCommission({
      tier: "",
      minSales: "",
      maxSales: "",
      commissionPercent: "",
      bonusAmount: "",
      status: "Active"
    });
    setIsAddingCommission(false);

    // Show success toast
    toast({
      title: "Commission Tier Added",
      description: `New commission tier "${commissionToAdd.tier}" has been added successfully.`,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Commission structure updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Commission Structure Management
              </CardTitle>
              <CardDescription>
                Define commission structures and bonus plans for the sales team
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Percent className="h-6 w-6 text-indigo-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Card Commission</p>
                  <p className="text-2xl font-bold">
                    {healthCardCommission.length} Tiers
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loan Commission</p>
                  <p className="text-2xl font-bold">
                    {loanCommission.length} Tiers
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bonus Plans</p>
                  <p className="text-2xl font-bold">
                    {bonusStructure.length} Plans
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="health-card">Health Card Commission</TabsTrigger>
              <TabsTrigger value="loan">Loan Commission</TabsTrigger>
              <TabsTrigger value="bonus">Bonus Plans</TabsTrigger>
            </TabsList>
            
            <TabsContent value="health-card">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddingCommission(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Commission Tier
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Sales Range</TableHead>
                      <TableHead>Commission (%)</TableHead>
                      <TableHead>Bonus Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthCardCommission.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">{commission.id}</TableCell>
                        <TableCell>{commission.tier}</TableCell>
                        <TableCell>
                          {commission.minSales} - {commission.maxSales ? commission.maxSales : '∞'} cards
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Percent className="mr-1 h-3 w-3 text-muted-foreground" /> 
                            {commission.commissionPercent}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                            {commission.bonusAmount.toLocaleString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={commission.status === "Active" ? "default" : "outline"}
                            className={commission.status === "Active" ? "bg-green-500" : ""}
                          >
                            {commission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditCommission(commission.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="loan">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddingCommission(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Commission Tier
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Loan Amount Range</TableHead>
                      <TableHead>Commission (%)</TableHead>
                      <TableHead>Bonus Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanCommission.map((commission) => (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">{commission.id}</TableCell>
                        <TableCell>{commission.tier}</TableCell>
                        <TableCell>
                          {commission.minAmount.toLocaleString('en-IN')} - {commission.maxAmount ? commission.maxAmount.toLocaleString('en-IN') : '∞'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Percent className="mr-1 h-3 w-3 text-muted-foreground" /> 
                            {commission.commissionPercent}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                            {commission.bonusAmount.toLocaleString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={commission.status === "Active" ? "default" : "outline"}
                            className={commission.status === "Active" ? "bg-green-500" : ""}
                          >
                            {commission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditCommission(commission.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="bonus">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setIsAddingCommission(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bonus Plan
                </Button>
              </div>
              
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Bonus Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Criteria</TableHead>
                      <TableHead>Applicable To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bonusStructure.map((bonus) => (
                      <TableRow key={bonus.id}>
                        <TableCell className="font-medium">{bonus.id}</TableCell>
                        <TableCell>{bonus.name}</TableCell>
                        <TableCell>{bonus.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <DollarSign className="mr-1 h-3 w-3 text-muted-foreground" />
                            {bonus.amount.toLocaleString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell>{bonus.criteria}</TableCell>
                        <TableCell>{bonus.applicableTo}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={bonus.status === "Active" ? "default" : "outline"}
                            className={bonus.status === "Active" ? "bg-green-500" : ""}
                          >
                            {bonus.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditCommission(bonus.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Last updated: 05 April 2025
          </div>
          <Button variant="outline" size="sm">
            Export Structure
          </Button>
        </CardFooter>
      </Card>

      {/* Add Commission Dialog */}
      <Dialog open={isAddingCommission} onOpenChange={setIsAddingCommission}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Commission Tier</DialogTitle>
            <DialogDescription>
              Set a new commission tier for health card sales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tier">Tier Name</Label>
              <Select 
                value={newCommission.tier} 
                onValueChange={(value) => setNewCommission({ ...newCommission, tier: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minSales">Minimum Sales</Label>
              <Input
                id="minSales"
                type="number"
                placeholder="Enter minimum sales"
                value={newCommission.minSales}
                onChange={(e) => setNewCommission({ ...newCommission, minSales: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSales">Maximum Sales (Optional)</Label>
              <Input
                id="maxSales"
                type="number"
                placeholder="Enter maximum sales"
                value={newCommission.maxSales}
                onChange={(e) => setNewCommission({ ...newCommission, maxSales: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionPercent">Commission Percentage</Label>
              <Input
                id="commissionPercent"
                type="number"
                placeholder="Enter commission percentage"
                value={newCommission.commissionPercent}
                onChange={(e) => setNewCommission({ ...newCommission, commissionPercent: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bonusAmount">Bonus Amount</Label>
              <Input
                id="bonusAmount"
                type="number"
                placeholder="Enter bonus amount"
                value={newCommission.bonusAmount}
                onChange={(e) => setNewCommission({ ...newCommission, bonusAmount: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddingCommission(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCommission}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add Tier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommissionStructure;
