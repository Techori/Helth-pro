
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Target, Search, Plus, ArrowUpDown, Calendar, Users, CreditCard, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SalesTargetManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("team");

  // Mock data for sales targets
  const teamTargets = [
    {
      id: "TT-001",
      teamName: "North Zone Team",
      manager: "Vikram Malhotra",
      healthCardTarget: 500,
      healthCardAchieved: 342,
      loanTarget: 200,
      loanAchieved: 158,
      period: "Q2 2025",
      status: "In Progress"
    },
    {
      id: "TT-002",
      teamName: "South Zone Team",
      manager: "Priya Singh",
      healthCardTarget: 450,
      healthCardAchieved: 380,
      loanTarget: 180,
      loanAchieved: 165,
      period: "Q2 2025",
      status: "In Progress"
    },
    {
      id: "TT-003",
      teamName: "East Zone Team",
      manager: "Rahul Sharma",
      healthCardTarget: 400,
      healthCardAchieved: 215,
      loanTarget: 150,
      loanAchieved: 82,
      period: "Q2 2025",
      status: "In Progress"
    },
    {
      id: "TT-004",
      teamName: "West Zone Team",
      manager: "Ananya Patel",
      healthCardTarget: 480,
      healthCardAchieved: 405,
      loanTarget: 190,
      loanAchieved: 176,
      period: "Q2 2025",
      status: "In Progress"
    },
    {
      id: "TT-005",
      teamName: "Corporate Sales Team",
      manager: "Sanjay Mehta",
      healthCardTarget: 600,
      healthCardAchieved: 520,
      loanTarget: 250,
      loanAchieved: 198,
      period: "Q2 2025",
      status: "In Progress"
    }
  ];

  const individualTargets = [
    {
      id: "IT-001",
      name: "Ajay Kumar",
      team: "North Zone Team",
      healthCardTarget: 80,
      healthCardAchieved: 65,
      loanTarget: 30,
      loanAchieved: 22,
      period: "Q2 2025",
      status: "On Track"
    },
    {
      id: "IT-002",
      name: "Meera Singh",
      team: "North Zone Team",
      healthCardTarget: 80,
      healthCardAchieved: 72,
      loanTarget: 30,
      loanAchieved: 28,
      period: "Q2 2025",
      status: "On Track"
    },
    {
      id: "IT-003",
      name: "Rohit Verma",
      team: "South Zone Team",
      healthCardTarget: 75,
      healthCardAchieved: 42,
      loanTarget: 25,
      loanAchieved: 12,
      period: "Q2 2025",
      status: "At Risk"
    },
    {
      id: "IT-004",
      name: "Deepika Shah",
      team: "West Zone Team",
      healthCardTarget: 80,
      healthCardAchieved: 78,
      loanTarget: 30,
      loanAchieved: 32,
      period: "Q2 2025",
      status: "Exceeded"
    },
    {
      id: "IT-005",
      name: "Amit Patel",
      team: "Corporate Sales Team",
      healthCardTarget: 100,
      healthCardAchieved: 105,
      loanTarget: 40,
      loanAchieved: 45,
      period: "Q2 2025",
      status: "Exceeded"
    }
  ];

  const filteredTeamTargets = teamTargets.filter(
    target => 
      target.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIndividualTargets = individualTargets.filter(
    target => 
      target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      target.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTarget = () => {
    toast({
      title: "Create New Target",
      description: "Target creation form will open",
    });
  };

  const handleEditTarget = (id: string) => {
    toast({
      title: "Edit Target",
      description: `Edit target with ID: ${id}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Sales Target Management
              </CardTitle>
              <CardDescription>
                Set and manage sales targets for teams and individual sales staff
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
              <Button onClick={handleAddTarget}>
                <Plus className="mr-2 h-4 w-4" />
                New Target
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Teams</p>
                  <p className="text-2xl font-bold">{teamTargets.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{individualTargets.length}</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Card Sales</p>
                  <p className="text-2xl font-bold">
                    {teamTargets.reduce((sum, target) => sum + target.healthCardAchieved, 0)}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Loan Sales</p>
                  <p className="text-2xl font-bold">
                    {teamTargets.reduce((sum, target) => sum + target.loanAchieved, 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="team">Team Targets</TabsTrigger>
              <TabsTrigger value="individual">Individual Targets</TabsTrigger>
              <TabsTrigger value="period">Target Periods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="team">
              {filteredTeamTargets.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Health Card Target
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Health Card Progress</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Loan Target
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Loan Progress</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeamTargets.map((target) => (
                        <TableRow key={target.id}>
                          <TableCell className="font-medium">{target.id}</TableCell>
                          <TableCell>{target.teamName}</TableCell>
                          <TableCell>{target.manager}</TableCell>
                          <TableCell>{target.healthCardTarget}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    (target.healthCardAchieved / target.healthCardTarget) >= 1 
                                      ? 'bg-green-500' 
                                      : (target.healthCardAchieved / target.healthCardTarget) >= 0.7 
                                      ? 'bg-amber-500' 
                                      : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, (target.healthCardAchieved / target.healthCardTarget) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {target.healthCardAchieved}/{target.healthCardTarget} ({Math.round((target.healthCardAchieved / target.healthCardTarget) * 100)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{target.loanTarget}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    (target.loanAchieved / target.loanTarget) >= 1 
                                      ? 'bg-green-500' 
                                      : (target.loanAchieved / target.loanTarget) >= 0.7 
                                      ? 'bg-amber-500' 
                                      : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, (target.loanAchieved / target.loanTarget) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {target.loanAchieved}/{target.loanTarget} ({Math.round((target.loanAchieved / target.loanTarget) * 100)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{target.period}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                target.status === "Completed" ? "border-green-500 text-green-600" : 
                                "border-amber-500 text-amber-600"
                              }
                            >
                              {target.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditTarget(target.id)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-md border">
                  <p className="text-muted-foreground">No team targets found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="individual">
              {filteredIndividualTargets.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Health Card Target
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Health Card Progress</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            Loan Target
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Loan Progress</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIndividualTargets.map((target) => (
                        <TableRow key={target.id}>
                          <TableCell className="font-medium">{target.id}</TableCell>
                          <TableCell>{target.name}</TableCell>
                          <TableCell>{target.team}</TableCell>
                          <TableCell>{target.healthCardTarget}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    (target.healthCardAchieved / target.healthCardTarget) > 1 
                                      ? 'bg-green-500' 
                                      : (target.healthCardAchieved / target.healthCardTarget) >= 0.7 
                                      ? 'bg-amber-500' 
                                      : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, (target.healthCardAchieved / target.healthCardTarget) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {target.healthCardAchieved}/{target.healthCardTarget} ({Math.round((target.healthCardAchieved / target.healthCardTarget) * 100)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{target.loanTarget}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    (target.loanAchieved / target.loanTarget) > 1 
                                      ? 'bg-green-500' 
                                      : (target.loanAchieved / target.loanTarget) >= 0.7 
                                      ? 'bg-amber-500' 
                                      : 'bg-red-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, (target.loanAchieved / target.loanTarget) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {target.loanAchieved}/{target.loanTarget} ({Math.round((target.loanAchieved / target.loanTarget) * 100)}%)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{target.period}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline"
                              className={
                                target.status === "Exceeded" ? "border-green-500 text-green-600" : 
                                target.status === "On Track" ? "border-blue-500 text-blue-600" : 
                                "border-red-500 text-red-600"
                              }
                            >
                              {target.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditTarget(target.id)}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-md border">
                  <p className="text-muted-foreground">No individual targets found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="period">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Period Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">P-001</TableCell>
                      <TableCell>Q1 2025</TableCell>
                      <TableCell>01/01/2025</TableCell>
                      <TableCell>31/03/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">P-002</TableCell>
                      <TableCell>Q2 2025</TableCell>
                      <TableCell>01/04/2025</TableCell>
                      <TableCell>30/06/2025</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">P-003</TableCell>
                      <TableCell>Q3 2025</TableCell>
                      <TableCell>01/07/2025</TableCell>
                      <TableCell>30/09/2025</TableCell>
                      <TableCell>
                        <Badge variant="outline">Upcoming</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-xs text-muted-foreground">
            Showing {activeTab === "team" ? filteredTeamTargets.length : filteredIndividualTargets.length} results
          </div>
          <Button variant="outline" size="sm">
            Download Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SalesTargetManagement;
