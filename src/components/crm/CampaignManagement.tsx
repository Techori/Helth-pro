import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, Users, BarChart2, Target, Calendar, ArrowUpRight, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type Campaign = {
  id: string;
  name: string;
  type: "Email" | "SMS" | "Social Media" | "Content" | "Event";
  status: "Draft" | "Active" | "Paused" | "Completed" | "Upcoming";
  startDate: string;
  endDate: string;
  target: string;
  budget: number;
  reach: number;
  conversion: number;
  description: string;
};

const CampaignManagement = () => {
  const { toast } = useToast();
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    name: "",
    type: "Email",
    status: "Draft",
    startDate: "",
    endDate: "",
    target: "",
    budget: 0,
    reach: 0,
    conversion: 0,
    description: "",
  });

  // Mock data for campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "camp-1",
      name: "Health Card Awareness",
      type: "Email",
      status: "Active",
      startDate: "2023-11-15",
      endDate: "2023-12-15",
      target: "Hospital Administrators",
      budget: 50000,
      reach: 12450,
      conversion: 3.8,
      description: "Email campaign targeting hospital administrators to promote premium health cards.",
    },
    {
      id: "camp-2",
      name: "Medical Loan Benefits",
      type: "Content",
      status: "Active",
      startDate: "2023-11-01",
      endDate: "2023-12-31",
      target: "Healthcare Providers",
      budget: 75000,
      reach: 8300,
      conversion: 2.6,
      description: "Content marketing campaign highlighting the benefits of medical loans for healthcare providers.",
    },
    {
      id: "camp-3",
      name: "Hospital Partnership Program",
      type: "Event",
      status: "Upcoming",
      startDate: "2023-12-10",
      endDate: "2023-12-12",
      target: "Key Hospital Decision Makers",
      budget: 120000,
      reach: 0,
      conversion: 0,
      description: "Virtual event to showcase partnership opportunities for hospitals.",
    },
    {
      id: "camp-4",
      name: "End of Year Promotion",
      type: "SMS",
      status: "Draft",
      startDate: "2023-12-15",
      endDate: "2023-12-31",
      target: "Existing Hospital Partners",
      budget: 25000,
      reach: 0,
      conversion: 0,
      description: "SMS campaign for year-end promotions on health cards and loans.",
    },
  ]);

  const handleAddCampaign = () => {
    if (!newCampaign.name || !newCampaign.startDate || !newCampaign.target) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const campaign: Campaign = {
      id: `camp-${Date.now()}`,
      name: newCampaign.name || "",
      type: newCampaign.type as "Email" | "SMS" | "Social Media" | "Content" | "Event" || "Email",
      status: newCampaign.status as "Draft" | "Active" | "Paused" | "Completed" | "Upcoming" || "Draft",
      startDate: newCampaign.startDate || "",
      endDate: newCampaign.endDate || "",
      target: newCampaign.target || "",
      budget: newCampaign.budget || 0,
      reach: 0,
      conversion: 0,
      description: newCampaign.description || "",
    };

    setCampaigns([...campaigns, campaign]);
    setNewCampaign({
      name: "",
      type: "Email",
      status: "Draft",
      startDate: "",
      endDate: "",
      target: "",
      budget: 0,
      reach: 0,
      conversion: 0,
      description: "",
    });
    setIsAddCampaignOpen(false);

    toast({
      title: "Campaign Created",
      description: "Your new marketing campaign has been created successfully.",
    });
  };

  const getCampaignTypeBadge = (type: "Email" | "SMS" | "Social Media" | "Content" | "Event") => {
    switch (type) {
      case "Email":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">{type}</Badge>;
      case "SMS":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">{type}</Badge>;
      case "Social Media":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">{type}</Badge>;
      case "Content":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{type}</Badge>;
      case "Event":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getCampaignStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{status}</Badge>;
      case "Paused":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">{status}</Badge>;
      case "Completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{status}</Badge>;
      case "Draft":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
      case "Upcoming":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const changeCampaignStatus = (campaignId: string, newStatus: "Draft" | "Active" | "Paused" | "Completed" | "Upcoming") => {
    const updatedCampaigns = campaigns.map(campaign => 
      campaign.id === campaignId ? {...campaign, status: newStatus} : campaign
    );
    
    setCampaigns(updatedCampaigns);
    
    toast({
      title: "Status Updated",
      description: `Campaign status changed to ${newStatus}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign Management</h2>
          <p className="text-muted-foreground">
            Create and manage marketing campaigns for healthcare products
          </p>
        </div>
        <Dialog open={isAddCampaignOpen} onOpenChange={setIsAddCampaignOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Set up a new marketing campaign to target healthcare organizations.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name*</Label>
                  <Input
                    id="campaign-name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                    placeholder="Enter campaign name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type*</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value) => setNewCampaign({...newCampaign, type: value as any})}
                  >
                    <SelectTrigger id="campaign-type">
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="SMS">SMS</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Content">Content</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-start">Start Date*</Label>
                  <Input
                    id="campaign-start"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-end">End Date</Label>
                  <Input
                    id="campaign-end"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-target">Target Audience*</Label>
                  <Input
                    id="campaign-target"
                    value={newCampaign.target}
                    onChange={(e) => setNewCampaign({...newCampaign, target: e.target.value})}
                    placeholder="Enter target audience"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-budget">Budget (₹)</Label>
                  <Input
                    id="campaign-budget"
                    type="number"
                    value={newCampaign.budget || ""}
                    onChange={(e) => setNewCampaign({...newCampaign, budget: parseInt(e.target.value) || 0})}
                    placeholder="Enter campaign budget"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea
                  id="campaign-description"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                  placeholder="Enter campaign description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCampaignOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCampaign}>
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground">
              Running campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, campaign) => sum + campaign.reach, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Contacts reached
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Conversion Rate</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.length > 0 
                ? (campaigns
                    .filter(c => c.conversion > 0)
                    .reduce((sum, campaign) => sum + campaign.conversion, 0) / 
                    campaigns.filter(c => c.conversion > 0).length)
                    .toFixed(1) + '%'
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average across active campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-campaigns">
        <TabsList>
          <TabsTrigger value="all-campaigns">All Campaigns</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-campaigns" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Dashboard</CardTitle>
              <CardDescription>Manage all your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaigns.length > 0 ? (
                  campaigns.map((campaign) => (
                    <div key={campaign.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{campaign.name}</h3>
                            {getCampaignTypeBadge(campaign.type)}
                            {getCampaignStatusBadge(campaign.status)}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{campaign.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                              Actions <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => changeCampaignStatus(campaign.id, "Active")}>
                              Set to Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeCampaignStatus(campaign.id, "Paused")}>
                              Pause Campaign
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => changeCampaignStatus(campaign.id, "Completed")}>
                              Mark as Completed
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Target</p>
                          <p className="font-medium">{campaign.target}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Timeline</p>
                          <p className="font-medium">
                            {new Date(campaign.startDate).toLocaleDateString()} 
                            {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Budget</p>
                          <p className="font-medium">₹{campaign.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Performance</p>
                          <div className="flex items-center gap-2">
                            <Progress value={campaign.reach > 0 ? 50 : 0} className="h-2" />
                            <span className="text-xs">{campaign.reach > 0 ? `${campaign.conversion}%` : "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No campaigns found. Create a new campaign to get started.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>Currently running marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaigns.filter(c => c.status === "Active").length > 0 ? (
                  campaigns.filter(c => c.status === "Active").map((campaign) => (
                    <div key={campaign.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{campaign.name}</h3>
                            {getCampaignTypeBadge(campaign.type)}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{campaign.description}</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2 md:mt-0">
                          View Details
                        </Button>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Reach</p>
                          <p className="font-medium">{campaign.reach.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Conversion</p>
                          <p className="font-medium">{campaign.conversion}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Timeline</p>
                          <p className="font-medium">
                            {new Date(campaign.startDate).toLocaleDateString()} 
                            {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Performance</p>
                          <div className="flex items-center gap-2">
                            <Progress value={50} className="h-2" />
                            <span className="text-xs">50%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No active campaigns found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Campaigns</CardTitle>
              <CardDescription>Scheduled marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.filter(c => c.status === "Upcoming" || c.status === "Draft").length > 0 ? (
                  campaigns.filter(c => c.status === "Upcoming" || c.status === "Draft").map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          {getCampaignTypeBadge(campaign.type)}
                          {getCampaignStatusBadge(campaign.status)}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Starts {new Date(campaign.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No upcoming campaigns found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Campaigns</CardTitle>
              <CardDescription>Previous marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.filter(c => c.status === "Completed").length > 0 ? (
                  campaigns.filter(c => c.status === "Completed").map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{campaign.name}</h3>
                          {getCampaignTypeBadge(campaign.type)}
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {campaign.reach.toLocaleString()} reached
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {campaign.conversion}% conversion
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No completed campaigns found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManagement;
