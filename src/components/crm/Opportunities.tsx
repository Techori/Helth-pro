
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Target, PlusCircle, DollarSign } from "lucide-react";

const opportunities = [
  {
    id: "OPP001",
    name: "Metro Hospital - Health Card Integration",
    customer: "Metro Hospital",
    value: "₹18,50,000",
    stage: "Proposal",
    probability: "65%",
    expectedClose: "2023-05-15",
    owner: "Priya Sharma"
  },
  {
    id: "OPP002",
    name: "City Care Clinic - Loan Application System",
    customer: "City Care Clinic",
    value: "₹12,25,000",
    stage: "Negotiation",
    probability: "80%",
    expectedClose: "2023-05-10",
    owner: "Vikram Singh"
  },
  {
    id: "OPP003",
    name: "Health First Hospital - Full Platform Integration",
    customer: "Health First Hospital",
    value: "₹32,75,000",
    stage: "Discovery",
    probability: "40%",
    expectedClose: "2023-06-20",
    owner: "Rahul Verma"
  },
  {
    id: "OPP004",
    name: "Wellness Medical Center - Health Card Program",
    customer: "Wellness Medical Center",
    value: "₹9,80,000",
    stage: "Closed Won",
    probability: "100%",
    expectedClose: "2023-04-01",
    owner: "Neha Gupta"
  },
  {
    id: "OPP005",
    name: "Care Plus Hospital - Premium Integration",
    customer: "Care Plus Hospital",
    value: "₹24,50,000",
    stage: "Qualification",
    probability: "30%",
    expectedClose: "2023-07-05",
    owner: "Priya Sharma"
  }
];

const Opportunities = () => {
  const getStageBadge = (stage: string) => {
    const colors = {
      "Discovery": "bg-blue-100 text-blue-800",
      "Qualification": "bg-purple-100 text-purple-800",
      "Proposal": "bg-yellow-100 text-yellow-800",
      "Negotiation": "bg-orange-100 text-orange-800",
      "Closed Won": "bg-green-100 text-green-800",
      "Closed Lost": "bg-red-100 text-red-800"
    };
    return colors[stage as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Opportunities</h2>
          <p className="text-muted-foreground">
            Track and manage your sales pipeline and opportunities
          </p>
        </div>
        <Button className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          New Opportunity
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹97,80,000</div>
            <p className="text-xs text-muted-foreground">
              Across all active opportunities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">
              Based on closed deals this quarter
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹42,35,000</div>
            <p className="text-xs text-muted-foreground">
              Weighted by probability
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 pb-0 pt-4">
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead className="hidden lg:table-cell">Probability</TableHead>
                  <TableHead className="hidden lg:table-cell">Close Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.id}</TableCell>
                    <TableCell>{opportunity.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{opportunity.customer}</TableCell>
                    <TableCell>{opportunity.value}</TableCell>
                    <TableCell>
                      <Badge className={getStageBadge(opportunity.stage)}>
                        {opportunity.stage}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{opportunity.probability}</TableCell>
                    <TableCell className="hidden lg:table-cell">{opportunity.expectedClose}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Opportunities;
