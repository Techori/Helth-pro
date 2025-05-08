
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIndianRupee, Plus, ArrowUpRight, Download } from "lucide-react";

const LoanSalesManagement = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Loan Facility Sales</CardTitle>
              <CardDescription>Manage and track loan applications</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Loan Application
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Total Loans Facilitated</p>
                  <p className="text-3xl font-bold">180</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BadgeIndianRupee className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>8% increase</span>
                <span className="text-muted-foreground ml-1">vs. last month</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
                  <p className="text-3xl font-bold">₹45.2L</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <BadgeIndianRupee className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>14% increase</span>
                <span className="text-muted-foreground ml-1">vs. last month</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Commission Earned</p>
                  <p className="text-3xl font-bold">₹2.76L</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BadgeIndianRupee className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span>12% increase</span>
                <span className="text-muted-foreground ml-1">vs. last month</span>
              </div>
            </Card>
          </div>
          
          <div className="rounded-md border p-6 text-center">
            <BadgeIndianRupee className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Loan Management Module</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Process new loan applications, track approval status, and calculate commission.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Loan Application
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanSalesManagement;
