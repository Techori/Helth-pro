
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, Plus, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const AdminPlatformFeeManagement = () => {
  const { toast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingFee, setIsAddingFee] = useState(false);

  // Mock data for platform fees (initial state, updated by API)
  const [feeStructures, setFeeStructures] = useState([
    {
      id: 1,
      category: "Hospital Registration",
      fee: 5000,
      type: "One-time",
      description: "One-time fee for hospital registration and onboarding",
      lastUpdated: "10/04/2025",
    },
    {
      id: 2,
      category: "Health Card Issuance",
      fee: 500,
      type: "One-time",
      description: "Fee charged per health card issued to patient",
      lastUpdated: "05/04/2025",
    },
    {
      id: 3,
      category: "Transaction Fee",
      fee: 2.5,
      type: "Percentage",
      description: "Percentage fee on each transaction using health card",
      lastUpdated: "01/04/2025",
    },
    {
      id: 4,
      category: "Loan Processing",
      fee: 1.75,
      type: "Percentage",
      description: "Processing fee for medical loans",
      lastUpdated: "15/03/2025",
    },
    {
      id: 5,
      category: "Annual Maintenance",
      fee: 1200,
      type: "Annual",
      description: "Annual maintenance fee for hospitals",
      lastUpdated: "20/02/2025",
    },
  ]);

  const [editingFee, setEditingFee] = useState({
    fee: 0,
    description: "",
  });

  const [newFee, setNewFee] = useState({
    category: "",
    fee: 0,
    type: "",
    description: "",
  });

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingFee({
      fee: feeStructures[index].fee,
      description: feeStructures[index].description,
    });
  };

    const handleSave = async (index: number) => {
    // Validate form data
    if (editingFee.fee < 0 || isNaN(editingFee.fee)) {
      toast({
        title: "Validation Error",
        description: "Fee amount must be a valid non-negative number",
        variant: "destructive",
      });
      return;
    }
    if (!editingFee.description) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }

    const updatedFeeStructure = {
      ...feeStructures[index],
      fee: editingFee.fee,
      description: editingFee.description,
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
          description: "Please log in to update a fee.",
        });
        return;
      }

      // Optimistic update
      const updatedFeeStructures = [...feeStructures];
      updatedFeeStructures[index] = updatedFeeStructure;
      setFeeStructures(updatedFeeStructures);

      // Send request to backend
      const response = await fetch(`api/admin/update-fee/${feeStructures[index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fee: editingFee.fee,
          description: editingFee.description,
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
        setFeeStructures(feeStructures);
        throw new Error(data.msg || "Failed to update fee");
      }

      // Update state with backend response
      setFeeStructures((prevFees) =>
        prevFees.map((fee, i) =>
          i === index ? { ...fee, ...data.feeStructure } : fee
        )
      );

      setEditingIndex(null);

      toast({
        title: "Fee Updated",
        description: `Fee for ${updatedFeeStructure.category} has been updated successfully.`,
      });
    } catch (error) {
      console.error("handleSave error:", error.message);
      // Rollback optimistic update
      setFeeStructures(feeStructures);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update fee. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  const handleAddFee = async () => {
    // Validate form data
    if (!newFee.category || !newFee.type || !newFee.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (newFee.fee < 0 || isNaN(newFee.fee)) {
      toast({
        title: "Validation Error",
        description: "Fee amount must be a valid non-negative number",
        variant: "destructive",
      });
      return;
    }

    // Declare newFeeId outside try block
    const newFeeId = feeStructures.length + 1;

    try {
      // Get JWT token
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to add a fee.",
        });
        return;
      }

      // Optimistic update
      const newFeeStructure = {
        id: newFeeId,
        category: newFee.category,
        fee: Number(newFee.fee),
        type: newFee.type,
        description: newFee.description,
        lastUpdated: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).replace(/\//g, "/"),
      };

      setFeeStructures([newFeeStructure, ...feeStructures]);

      // Send request to backend
      const response = await fetch("api/admin/add-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: newFee.category,
          fee: Number(newFee.fee),
          type: newFee.type,
          description: newFee.description,
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
        setFeeStructures(feeStructures.filter((fee) => fee.id !== newFeeId));
        throw new Error(data.msg || "Failed to add fee");
      }

      // Update state with backend ID
      setFeeStructures((prevFees) =>
        prevFees.map((fee) =>
          fee.id === newFeeId ? { ...fee, id: data.feeStructure._id } : fee
        )
      );

      // Reset form and close dialog
      setNewFee({
        category: "",
        fee: 0,
        type: "",
        description: "",
      });
      setIsAddingFee(false);

      toast({
        title: "Fee Added",
        description: `New fee for ${newFee.category} has been added successfully.`,
      });
    } catch (error) {
      console.error("handleAddFee error:", error.message);
      // Rollback optimistic update
      setFeeStructures(feeStructures.filter((fee) => fee.id !== newFeeId));
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add fee. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Platform Fee Management</CardTitle>
              <CardDescription>Manage and update platform fees and charges</CardDescription>
            </div>
            <Button onClick={() => setIsAddingFee(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Fee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">
                    {feeStructures.filter((f) => f.type === "One-time").length}
                  </div>
                  <div className="text-sm font-medium">One-time Fees</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-500">
                    {feeStructures.filter((f) => f.type === "Percentage").length}
                  </div>
                  <div className="text-sm font-medium">Percentage Fees</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-amber-500">
                    {feeStructures.filter((f) => f.type === "Annual").length}
                  </div>
                  <div className="text-sm font-medium">Recurring Fees</div>
                </div>
              </Card>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Fee Amount</TableHead>
                    <TableHead>Fee Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feeStructures.map((fee, index) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.category}</TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            type="number"
                            value={editingFee.fee}
                            onChange={(e) =>
                              setEditingFee({ ...editingFee, fee: parseFloat(e.target.value) })
                            }
                            className="w-24"
                          />
                        ) : (
                          <>
                            {fee.type === "Percentage" ? `${fee.fee}%` : `₹${fee.fee.toLocaleString()}`}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            fee.type === "Percentage"
                              ? "default"
                              : fee.type === "One-time"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {fee.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editingFee.description}
                            onChange={(e) =>
                              setEditingFee({ ...editingFee, description: e.target.value })
                            }
                            className="w-full"
                          />
                        ) : (
                          fee.description
                        )}
                      </TableCell>
                      <TableCell>{fee.lastUpdated}</TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleSave(index)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={handleCancel}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(index)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Last updated platform fee structure: April 6, 2025</p>
        </CardFooter>
      </Card>

      <Dialog open={isAddingFee} onOpenChange={setIsAddingFee}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Fee</DialogTitle>
            <DialogDescription>Add a new fee structure to the platform</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                value={newFee.category}
                onChange={(e) => setNewFee({ ...newFee, category: e.target.value })}
                className="col-span-3"
                placeholder="Enter fee category"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fee" className="text-right">
                Fee Amount
              </Label>
              <Input
                id="fee"
                type="number"
                value={newFee.fee}
                onChange={(e) => setNewFee({ ...newFee, fee: parseFloat(e.target.value) })}
                className="col-span-3"
                placeholder="Enter fee amount"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Fee Type
              </Label>
              <Select
                value={newFee.type}
                onValueChange={(value) => setNewFee({ ...newFee, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-time">One-time</SelectItem>
                  <SelectItem value="Percentage">Percentage</SelectItem>
                  <SelectItem value="Annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newFee.description}
                onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
                className="col-span-3"
                placeholder="Enter fee description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFee(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFee}>Add Fee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPlatformFeeManagement;
