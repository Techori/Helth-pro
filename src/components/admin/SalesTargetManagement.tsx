
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Calendar } from "lucide-react";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF interface for TypeScript
interface ExtendedJsPDF extends jsPDF {
  lastAutoTable: { finalY: number };
}

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://helth-pro.onrender.com/api'
  : 'http://localhost:4000/api';

const SalesTargetManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({
    hospital: "",
    department: "",
    targetAmount: "",
    period: "",
    status: "Active",
  });

  const [salesTargets, setSalesTargets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSalesTargets = async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_URL}/admin/sales-targets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sales targets");
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);
      
      // Ensure we have an array of targets from the response
      const data = Array.isArray(responseData) ? responseData : responseData.salesTargets || [];
      
      // Transform the data to match our frontend structure
      const transformedTargets = data.map(target => ({
        id: target._id,
        hospital: target.hospital,
        department: target.department,
        targetAmount: target.targetAmount,
        currentAmount: target.currentAmount || 0,
        period: target.period,
        status: target.status,
        progress: target.currentAmount ? Math.round((target.currentAmount / target.targetAmount) * 100) : 0,
        lastUpdated: target.lastUpdated 
    }));

      setSalesTargets(transformedTargets);
    } catch (err) {
      console.error("Error fetching sales targets:", err);
      setError(err.message || "Failed to fetch sales targets");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch sales targets",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sales targets when component mounts
  useEffect(() => {
    fetchSalesTargets();
  }, []);

  const filteredTargets = salesTargets.filter(
    (target) =>
      target.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.period.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTarget = async () => {
    // Validate form data
    if (
      !newTarget.hospital ||
      !newTarget.department ||
      !newTarget.targetAmount ||
      !newTarget.period
    ) {
      toast({
        variant: "destructive",
        title: "Invalid form",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const targetAmount = Number(newTarget.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Target amount must be a positive number.",
      });
      return;
    }

    // Generate a temporary target ID
    const tempTargetId = `ST-${String(salesTargets.length + 1).padStart(3, "0")}`;

    // Create new target object
    const targetToAdd = {
      id: tempTargetId,
      hospital: newTarget.hospital,
      department: newTarget.department,
      targetAmount,
      currentAmount: 0,
      period: newTarget.period,
      status: newTarget.status,
      progress: 0,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "/"),
    };

    try {
      // Get JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to add a sales target.",
        });
        return;
      }

      // Optimistic update
      setSalesTargets((prevTargets) => [...prevTargets, targetToAdd]);

      // Send request to backend
      const response = await fetch(`${API_URL}/admin/add-sales-target`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hospital: newTarget.hospital,
          department: newTarget.department,
          targetAmount,
          period: newTarget.period,
          status: newTarget.status,
        }),
      });

      // Log raw response for debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("JSON parse error:", err.message);
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        // Rollback optimistic update
        setSalesTargets((prevTargets) =>
          prevTargets.filter((target) => target.id !== tempTargetId)
        );
        throw new Error(data.msg || "Failed to add sales target");
      }

      // Refresh the sales targets from the backend
      await fetchSalesTargets();

      // Reset form and close dialog
      setNewTarget({
        hospital: "",
        department: "",
        targetAmount: "",
        period: "",
        status: "Active",
      });
      setIsAddingTarget(false);

      toast({
        title: "Target Added",
        description: `Sales target for ${newTarget.hospital} - ${newTarget.department} has been added successfully.`,
      });
    } catch (error) {
      console.error("handleAddTarget error:", error.message);
      // Rollback optimistic update
      setSalesTargets((prevTargets) =>
        prevTargets.filter((target) => target.id !== tempTargetId)
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add sales target. Please try again.",
      });
    }
  };

  const handleExportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text("Sales Targets Report", 14, 22);

      // Add generation date
      doc.setFontSize(10);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}`,
        14,
        30
      );

      // Prepare table data
      const tableData = filteredTargets.map((target) => [
        target.hospital,
        target.department,
        `Rs ${target.targetAmount.toLocaleString()}`,
        `Rs ${target.currentAmount.toLocaleString()}`,
        `${target.progress}%`,
        target.period,
        target.status,
        target.lastUpdated,
      ]);

      // Define table columns
      const tableColumns = [
        "Hospital",
        "Department",
        "Target Amount",
        "Current Amount",
        "Progress",
        "Period",
        "Status",
        "Last Updated",
      ];

      // Add table using autoTable
      autoTable(doc, {
        head: [tableColumns],
        body: tableData,
        startY: 40,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 20 },
          5: { cellWidth: 20 },
          6: { cellWidth: 20 },
          7: { cellWidth: 25 },
        },
      });

      // Add footer with total counts
      const finalY = (doc as ExtendedJsPDF).lastAutoTable.finalY || 40;
      doc.setFontSize(10);
      doc.text(`Total Targets: ${filteredTargets.length}`, 14, finalY + 10);

      // Save the PDF
      doc.save(`Sales_Targets_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("handleExportToPDF error:", error.message);
      toast({
        variant: "destructive",
        title: "Export Error",
        description: "Failed to export sales targets to PDF. Please try again.",
      });
    }
  };

  // Calculate total targets and progress
  const totalTargetAmount = salesTargets.reduce((sum, target) => sum + target.targetAmount, 0);
  const totalCurrentAmount = salesTargets.reduce((sum, target) => sum + target.currentAmount, 0);
  const overallProgress = totalTargetAmount
    ? Math.round((totalCurrentAmount / totalTargetAmount) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Sales Targets</CardTitle>
              <CardDescription>
                Set and monitor sales targets for partner hospitals
              </CardDescription>
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
              <Button onClick={() => setIsAddingTarget(true)}>
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
                <div className="text-4xl font-bold text-primary">
                  ₹{totalTargetAmount.toLocaleString()}
                </div>
                <div className="text-sm font-medium">Total Target</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-emerald-500">
                  ₹{totalCurrentAmount.toLocaleString()}
                </div>
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

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" onClick={fetchSalesTargets}>
                Retry
              </Button>
            </div>
          ) : filteredTargets.length > 0 ? (
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
            <Button variant="outline" onClick={handleExportToPDF}>
              Export Targets
            </Button>
          </div>
        </CardFooter>
      </Card>

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
              <Select
                value={newTarget.hospital}
                onValueChange={(value) => setNewTarget({ ...newTarget, hospital: value })}
              >
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
              <Select
                value={newTarget.department}
                onValueChange={(value) => setNewTarget({ ...newTarget, department: value })}
              >
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
              <Select
                value={newTarget.period}
                onValueChange={(value) => setNewTarget({ ...newTarget, period: value })}
              >
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
            <Button onClick={handleAddTarget}>Add Target</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesTargetManagement;
