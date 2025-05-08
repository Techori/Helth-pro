
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Save, Plus, Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminPlatformFeeManagement = () => {
  const { toast } = useToast();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Mock data for platform fees
  const [feeStructures, setFeeStructures] = useState([
    {
      id: 1,
      category: "Hospital Registration",
      fee: 5000,
      type: "One-time",
      description: "One-time fee for hospital registration and onboarding",
      lastUpdated: "10/04/2025"
    },
    {
      id: 2,
      category: "Health Card Issuance",
      fee: 500,
      type: "One-time",
      description: "Fee charged per health card issued to patient",
      lastUpdated: "05/04/2025"
    },
    {
      id: 3,
      category: "Transaction Fee",
      fee: 2.5,
      type: "Percentage",
      description: "Percentage fee on each transaction using health card",
      lastUpdated: "01/04/2025"
    },
    {
      id: 4,
      category: "Loan Processing",
      fee: 1.75,
      type: "Percentage",
      description: "Processing fee for medical loans",
      lastUpdated: "15/03/2025"
    },
    {
      id: 5,
      category: "Annual Maintenance",
      fee: 1200,
      type: "Annual",
      description: "Annual maintenance fee for hospitals",
      lastUpdated: "20/02/2025"
    }
  ]);
  
  const [editingFee, setEditingFee] = useState({
    fee: 0,
    description: ""
  });
  
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditingFee({
      fee: feeStructures[index].fee,
      description: feeStructures[index].description
    });
  };
  
  const handleSave = (index: number) => {
    const updatedFeeStructures = [...feeStructures];
    updatedFeeStructures[index] = {
      ...updatedFeeStructures[index],
      fee: editingFee.fee,
      description: editingFee.description,
      lastUpdated: new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      }).replace(/\//g, '/')
    };
    
    setFeeStructures(updatedFeeStructures);
    setEditingIndex(null);
    
    toast({
      title: "Fee Updated",
      description: `Fee for ${updatedFeeStructures[index].category} has been updated successfully.`,
    });
  };
  
  const handleCancel = () => {
    setEditingIndex(null);
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
            <Button>
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
                    {feeStructures.filter(f => f.type === "One-time").length}
                  </div>
                  <div className="text-sm font-medium">One-time Fees</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-500">
                    {feeStructures.filter(f => f.type === "Percentage").length}
                  </div>
                  <div className="text-sm font-medium">Percentage Fees</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-amber-500">
                    {feeStructures.filter(f => f.type === "Annual").length}
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
                            onChange={(e) => setEditingFee({ ...editingFee, fee: parseFloat(e.target.value) })}
                            className="w-24"
                          />
                        ) : (
                          <>
                            {fee.type === "Percentage" ? `${fee.fee}%` : `₹${fee.fee.toLocaleString()}`}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          fee.type === "Percentage" ? "default" : 
                          fee.type === "One-time" ? "secondary" : 
                          "outline"
                        }>
                          {fee.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {editingIndex === index ? (
                          <Input
                            value={editingFee.description}
                            onChange={(e) => setEditingFee({ ...editingFee, description: e.target.value })}
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
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={handleCancel}
                            >
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
    </div>
  );
};

export default AdminPlatformFeeManagement;
