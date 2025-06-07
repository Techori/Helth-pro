import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, TrendingUp, TrendingDown, Target, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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

const AdminSalesTargets = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({
    hospital: "",
    department: "",
    targetAmount: "",
    period: "",
    status: "Active"
  });

  // Convert to state variable
  const [salesTargets, setSalesTargets] = useState([
    {
      id: "ST-001",
      hospital: "City General Hospital",
      department: "Cardiology",
      targetAmount: 500000,
      currentAmount: 350000,
      period: "Q1 2025",
      status: "Active",
      progress: 70,
      lastUpdated: "01/04/2025"
    },
    {
      id: "ST-002",
      hospital: "LifeCare Hospital",
      department: "Orthopedics",
      targetAmount: 750000,
      currentAmount: 600000,
      period: "Q1 2025",
      status: "Active",
      progress: 80,
      lastUpdated: "01/04/2025"
    },
    {
      id: "ST-003",
      hospital: "Carewell Hospital",
      department: "Neurology",
      targetAmount: 1000000,
      currentAmount: 450000,
      period: "Q1 2025",
      status: "Active",
      progress: 45,
      lastUpdated: "01/04/2025"
    }
  ]);

  // Filter targets based on search term
  const filteredTargets = salesTargets.filter(
    target => 
      target.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTarget = () => {
    // Validate form data
    if (!newTarget.hospital || !newTarget.department || !newTarget.targetAmount || !newTarget.period) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    // Generate a new target ID
    const newTargetId = `ST-${String(salesTargets.length + 1).padStart(3, '0')}`;

    // Create new target object
    const targetToAdd = {
      id: newTargetId,
      hospital: newTarget.hospital,
      department: newTarget.department,
      targetAmount: Number(newTarget.targetAmount),
      currentAmount: 0,
      period: newTarget.period,
      status: newTarget.status,
      progress: 0,
      lastUpdated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '/')
    };

    // Add target to the list using setState
    setSalesTargets(prevTargets => [...prevTargets, targetToAdd]);

    // Reset form and close dialog
    setNewTarget({
      hospital: "",
      department: "",
      targetAmount: "",
      period: "",
      status: "Active"
    });
    setIsAddingTarget(false);

    // Show success toast
    toast({
      title: "Target Added",
      description: `Sales target for ${targetToAdd.hospital} - ${targetToAdd.department} has been added successfully.`,
    });
  };

  // Calculate total targets and progress
  const totalTargetAmount = salesTargets.reduce((sum, target) => sum + target.targetAmount, 0);
  const totalCurrentAmount = salesTargets.reduce((sum, target) => sum + target.currentAmount, 0);
  const overallProgress = Math.round((totalCurrentAmount / totalTargetAmount) * 100);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Sales Targets</CardTitle>
              <CardDescription>Set and monitor sales targets for partner hospitals</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search targets..."
                  className="pl-8 max-w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => setIsAddingTarget(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Target
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">₹{totalTargetAmount.toLocaleString()}</div>
                <div className="text-sm font-medium">Total Target</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-emerald-500">₹{totalCurrentAmount.toLocaleString()}</div>
                <div className="text-sm font-medium">Current Amount</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-blue-500">{overallProgress}%</div>
                <div className="text-sm font-medium">Overall Progress</div>
              </div>
            </Card>
          </div>
          
          {filteredTargets.length > 0 ? (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Target Amount</TableHead>
                    <TableHead>Current Amount</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTargets.map((target) => (
                    <TableRow key={target.id}>
                      <TableCell>{target.hospital}</TableCell>
                      <TableCell>{target.department}</TableCell>
                      <TableCell>₹{target.targetAmount.toLocaleString()}</TableCell>
                      <TableCell>₹{target.currentAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{ width: `${target.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{target.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{target.period}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={target.status === "Active" ? "default" : "outline"}
                          className={target.status === "Active" ? "bg-green-500" : ""}
                        >
                          {target.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{target.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <p className="text-muted-foreground">No targets found matching your search criteria</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTargets.length} of {salesTargets.length} targets
            </p>
            <Button variant="outline">Export Targets</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add Target Dialog */}
      <Dialog open={isAddingTarget} onOpenChange={setIsAddingTarget}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Sales Target</DialogTitle>
            <DialogDescription>
              Set a new sales target for a hospital department.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital</Label>
              <Select value={newTarget.hospital} onValueChange={(value) => setNewTarget({ ...newTarget, hospital: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="City General Hospital">City General Hospital</SelectItem>
                  <SelectItem value="LifeCare Hospital">LifeCare Hospital</SelectItem>
                  <SelectItem value="Carewell Hospital">Carewell Hospital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={newTarget.department} onValueChange={(value) => setNewTarget({ ...newTarget, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount (₹)</Label>
              <Input
                id="targetAmount"
                type="number"
                placeholder="Enter target amount"
                value={newTarget.targetAmount}
                onChange={(e) => setNewTarget({ ...newTarget, targetAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select value={newTarget.period} onValueChange={(value) => setNewTarget({ ...newTarget, period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1 2025">Q1 2025</SelectItem>
                  <SelectItem value="Q2 2025">Q2 2025</SelectItem>
                  <SelectItem value="Q3 2025">Q3 2025</SelectItem>
                  <SelectItem value="Q4 2025">Q4 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTarget(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTarget}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Add Target
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSalesTargets; 