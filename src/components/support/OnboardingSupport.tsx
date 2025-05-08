
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Filter, User, Calendar, Clock, FileText, 
  CheckCircle, XCircle, PlusCircle, Download, Upload
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogClose 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  Select, SelectContent, SelectGroup, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define types for better type safety
interface Document {
  name: string;
  status: "verified" | "pending" | "rejected" | "missing" | "onhold";
  uploadedAt?: string;
  verifiedAt?: string;
}

interface OnboardingCase {
  id: string;
  name: string;
  entity: string;
  type: "Hospital" | "Individual" | "Clinic" | "Pharmacy";
  status: "pending" | "active" | "completed" | "rejected" | "onhold";
  progress: number;
  stage: string;
  date: string;
  contact: string;
  email: string;
  documents: Document[];
  notes?: string[];
  assignedTo?: string;
}

const OnboardingSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCase, setSelectedCase] = useState<OnboardingCase | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newDocumentName, setNewDocumentName] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"date" | "progress" | "name">("date");
  const [onboardingCases, setOnboardingCases] = useState<OnboardingCase[]>([
    {
      id: "ONB-1001",
      name: "Dr. Rajesh Gupta",
      entity: "Apollo Hospital",
      type: "Hospital",
      status: "pending",
      progress: 30,
      stage: "Document Verification",
      date: "2025-05-01",
      contact: "+91 98765 43210",
      email: "dr.rajesh@apollohospital.com",
      documents: [
        { name: "Hospital License", status: "verified", uploadedAt: "2025-04-28", verifiedAt: "2025-04-30" },
        { name: "Doctor Registration", status: "pending", uploadedAt: "2025-04-29" },
        { name: "Tax Documents", status: "missing" },
      ],
      notes: ["Initial documents received", "Following up on missing tax documents"]
    },
    {
      id: "ONB-1002",
      name: "Meera Sharma",
      entity: "Patient",
      type: "Individual",
      status: "active",
      progress: 70,
      stage: "KYC Verification",
      date: "2025-05-03",
      contact: "+91 87654 32109",
      email: "meera.sharma@gmail.com",
      documents: [
        { name: "ID Proof", status: "verified", uploadedAt: "2025-05-01", verifiedAt: "2025-05-02" },
        { name: "Address Proof", status: "verified", uploadedAt: "2025-05-01", verifiedAt: "2025-05-02" },
        { name: "Income Proof", status: "pending", uploadedAt: "2025-05-02" },
      ],
      notes: ["All required documents submitted", "Income proof verification in progress"]
    },
    {
      id: "ONB-1003",
      name: "LifeCare Medical Center",
      entity: "LifeCare Hospital",
      type: "Hospital",
      status: "completed",
      progress: 100,
      stage: "Onboarded",
      date: "2025-04-25",
      contact: "+91 76543 21098",
      email: "admin@lifecaremedical.com",
      documents: [
        { name: "Hospital License", status: "verified", uploadedAt: "2025-04-20", verifiedAt: "2025-04-22" },
        { name: "Tax Documents", status: "verified", uploadedAt: "2025-04-20", verifiedAt: "2025-04-23" },
        { name: "Bank Details", status: "verified", uploadedAt: "2025-04-21", verifiedAt: "2025-04-24" },
      ],
      notes: ["All documents verified", "Account setup complete", "Welcome email sent"]
    },
    {
      id: "ONB-1004",
      name: "Rahul Kumar",
      entity: "Patient",
      type: "Individual",
      status: "rejected",
      progress: 50,
      stage: "Document Verification Failed",
      date: "2025-05-02",
      contact: "+91 65432 10987",
      email: "rahul.kumar@outlook.com",
      documents: [
        { name: "ID Proof", status: "verified", uploadedAt: "2025-05-01", verifiedAt: "2025-05-01" },
        { name: "Address Proof", status: "rejected", uploadedAt: "2025-05-01", verifiedAt: "2025-05-02" },
        { name: "Income Proof", status: "missing" },
      ],
      notes: ["Address proof documents seem forged", "Rejection email sent with explanation"]
    },
    {
      id: "ONB-1005",
      name: "MedLife Healthcare",
      entity: "MedLife Hospital",
      type: "Hospital",
      status: "onhold",
      progress: 60,
      stage: "Additional Documents Required",
      date: "2025-04-28",
      contact: "+91 54321 09876",
      email: "info@medlifehealthcare.com",
      documents: [
        { name: "Hospital License", status: "verified", uploadedAt: "2025-04-25", verifiedAt: "2025-04-26" },
        { name: "Doctor Registration", status: "verified", uploadedAt: "2025-04-25", verifiedAt: "2025-04-26" },
        { name: "Tax Documents", status: "onhold", uploadedAt: "2025-04-25" },
      ],
      notes: ["Tax documents need clarification", "Called and left message for finance department"]
    },
    {
      id: "ONB-1006",
      name: "City Health Clinic",
      entity: "City Health",
      type: "Clinic",
      status: "active",
      progress: 80,
      stage: "Final Verification",
      date: "2025-05-04",
      contact: "+91 43210 98765",
      email: "admin@cityhealthclinic.com",
      documents: [
        { name: "Clinic License", status: "verified", uploadedAt: "2025-05-02", verifiedAt: "2025-05-03" },
        { name: "Doctor Certificates", status: "verified", uploadedAt: "2025-05-02", verifiedAt: "2025-05-03" },
        { name: "Insurance Documents", status: "pending", uploadedAt: "2025-05-03" },
      ],
      notes: ["Insurance verification in progress"]
    },
    {
      id: "ONB-1007",
      name: "HealthPlus Pharmacy",
      entity: "HealthPlus",
      type: "Pharmacy",
      status: "pending",
      progress: 40,
      stage: "License Verification",
      date: "2025-05-05",
      contact: "+91 32109 87654",
      email: "contact@healthpluspharmacy.com",
      documents: [
        { name: "Pharmacy License", status: "pending", uploadedAt: "2025-05-04" },
        { name: "Drug Inventory", status: "pending", uploadedAt: "2025-05-04" },
        { name: "Staff Credentials", status: "missing" },
      ],
      notes: ["Awaiting staff credentials documentation"]
    }
  ]);

  // Filter onboarding cases based on search, active tab, and type filter
  const filteredCases = onboardingCases.filter(caseItem => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Status tab filter
    const matchesTab = activeTab === "all" || caseItem.status === activeTab;

    // Type filter
    const matchesType = !filterType || caseItem.type === filterType;

    return matchesSearch && matchesTab && matchesType;
  });

  // Sort cases based on the selected sort option
  const sortedCases = [...filteredCases].sort((a, b) => {
    switch(sortOption) {
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "progress":
        return b.progress - a.progress;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'onhold':
        return <Badge variant="secondary">On Hold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'missing':
      case 'onhold':
        return <FileText className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const handleViewDetails = (caseItem: OnboardingCase) => {
    setSelectedCase(caseItem);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!selectedCase) return;
    
    // Update the case status in the state
    setOnboardingCases(prevCases => {
      return prevCases.map(caseItem => {
        if (caseItem.id === selectedCase.id) {
          return {
            ...caseItem,
            status: newStatus as any,
            progress: newStatus === 'completed' ? 100 : caseItem.progress
          };
        }
        return caseItem;
      });
    });
    
    toast({
      title: "Status Updated",
      description: `Case ${selectedCase.id} status changed to ${newStatus}`,
    });
    setIsDetailsOpen(false);
  };

  const handleUpdateDocumentStatus = (docName: string, newStatus: "verified" | "pending" | "rejected" | "missing" | "onhold") => {
    if (!selectedCase) return;

    // Update document status in the selected case
    const updatedCase = {
      ...selectedCase,
      documents: selectedCase.documents.map(doc => {
        if (doc.name === docName) {
          return {
            ...doc, 
            status: newStatus,
            verifiedAt: newStatus === 'verified' ? new Date().toISOString().split('T')[0] : doc.verifiedAt
          };
        }
        return doc;
      })
    };

    // Update progress based on verified documents
    const totalDocs = updatedCase.documents.length;
    const verifiedDocs = updatedCase.documents.filter(doc => doc.status === 'verified').length;
    updatedCase.progress = Math.round((verifiedDocs / totalDocs) * 100);
    
    // Update in the main list
    setOnboardingCases(prevCases => {
      return prevCases.map(caseItem => {
        if (caseItem.id === selectedCase.id) {
          return updatedCase;
        }
        return caseItem;
      });
    });

    // Update the selected case for the dialog
    setSelectedCase(updatedCase);

    toast({
      title: "Document Status Updated",
      description: `${docName} status changed to ${newStatus}`,
    });
  };

  const handleAddNote = () => {
    if (!selectedCase || !newNote.trim()) return;

    // Add new note to the selected case
    const notes = [...(selectedCase.notes || []), newNote.trim()];
    const updatedCase = { ...selectedCase, notes };
    
    // Update in the main list
    setOnboardingCases(prevCases => {
      return prevCases.map(caseItem => {
        if (caseItem.id === selectedCase.id) {
          return updatedCase;
        }
        return caseItem;
      });
    });

    // Update the selected case for the dialog
    setSelectedCase(updatedCase);
    
    toast({
      title: "Note Added",
      description: `New note added to case ${selectedCase.id}`,
    });
    
    setNewNote("");
    setIsAddNoteOpen(false);
  };

  const handleAddDocument = () => {
    if (!selectedCase || !newDocumentName.trim()) return;

    // Add new document to the selected case
    const newDocument = { 
      name: newDocumentName.trim(), 
      status: "pending" as const,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    
    const documents = [...selectedCase.documents, newDocument];
    const updatedCase = { ...selectedCase, documents };
    
    // Update in the main list
    setOnboardingCases(prevCases => {
      return prevCases.map(caseItem => {
        if (caseItem.id === selectedCase.id) {
          return updatedCase;
        }
        return caseItem;
      });
    });

    // Update the selected case for the dialog
    setSelectedCase(updatedCase);
    
    toast({
      title: "Document Added",
      description: `${newDocumentName} added to case ${selectedCase.id}`,
    });
    
    setNewDocumentName("");
    setIsAddDocumentOpen(false);
  };

  const handleCreateCase = () => {
    toast({
      title: "Creating New Case",
      description: "Opening the new onboarding case form...",
    });
    // In a real app, this would open a form to create a new case
  };

  const handleApplyFilters = () => {
    toast({
      title: "Filters Applied",
      description: `Showing ${filteredCases.length} onboarding cases`,
    });
  };

  const handleContactUser = () => {
    if (!selectedCase) return;
    
    toast({
      title: "Contacting User",
      description: `Initiating contact with ${selectedCase.name} via ${selectedCase.email}`,
    });
  };

  useEffect(() => {
    // This would normally fetch data from an API
    console.log("Onboarding Support component mounted");
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">This module assists with user onboarding processes, documentation, and initial setup of accounts for both patients and hospitals.</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search by name, entity, email or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortOption} onValueChange={(value) => setSortOption(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="progress">Sort by Progress</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select value={filterType || ''} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Hospital">Hospital</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Clinic">Clinic</SelectItem>
                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="icon" 
              className="flex-shrink-0"
              onClick={handleApplyFilters}
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button 
              className="flex-shrink-0"
              onClick={handleCreateCase}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </div>

          <Tabs 
            defaultValue="all" 
            className="w-full" 
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4 flex overflow-x-auto">
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="onhold">On Hold</TabsTrigger>
            </TabsList>
            
            {["all", "pending", "active", "completed", "rejected", "onhold"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-2">
                {sortedCases.length > 0 ? (
                  sortedCases.map((caseItem) => (
                    <Card key={caseItem.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-full">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  {caseItem.name}
                                </h3>
                                {getStatusBadge(caseItem.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                  {caseItem.entity}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                  {caseItem.type}
                                </span>
                                <span className="flex items-center text-xs text-gray-500">
                                  ID: {caseItem.id}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-auto">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDetails(caseItem)}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => {
                                setSelectedCase(caseItem);
                                toast({
                                  title: "Contact Initiated",
                                  description: `Contacting ${caseItem.name} via ${caseItem.email}`,
                                });
                              }}
                            >
                              Contact
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Current Stage: {caseItem.stage}</span>
                            <span className="text-xs font-medium">{caseItem.progress}%</span>
                          </div>
                          <Progress value={caseItem.progress} className="h-2" />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between">
                          <div className="flex items-center mt-2">
                            <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                            <span className="text-xs text-gray-500 mr-4">
                              Started: {caseItem.date}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {caseItem.documents.map((doc, index) => (
                              <div key={index} className="flex items-center text-xs bg-gray-50 px-2 py-1 rounded">
                                {getDocumentStatusIcon(doc.status)}
                                <span className="ml-1">{doc.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No onboarding cases found matching your criteria.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Case Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Onboarding Case Details</DialogTitle>
            <DialogDescription>
              Review and manage onboarding information.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCase && (
            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Case ID</p>
                  <p>{selectedCase.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <div>{getStatusBadge(selectedCase.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p>{selectedCase.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Entity</p>
                  <p>{selectedCase.entity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p>{selectedCase.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{selectedCase.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p>{selectedCase.contact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-xs">{selectedCase.email}</p>
                </div>
                {selectedCase.assignedTo && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-500">Assigned To</p>
                    <p>{selectedCase.assignedTo}</p>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Stage: {selectedCase.stage}</p>
                <Progress value={selectedCase.progress} className="h-2" />
                <p className="text-xs text-right mt-1">{selectedCase.progress}% Complete</p>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 mb-2">Documents</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsAddDocumentOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Document
                  </Button>
                </div>
                <div className="space-y-2">
                  {selectedCase.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center">
                        {getDocumentStatusIcon(doc.status)}
                        <span className="ml-2">{doc.name}</span>
                      </div>
                      <div className="flex items-center">
                        {doc.uploadedAt && (
                          <span className="text-xs text-gray-500 mr-2">Uploaded: {doc.uploadedAt}</span>
                        )}
                        <Select 
                          value={doc.status} 
                          onValueChange={(value) => handleUpdateDocumentStatus(doc.name, value as any)}
                        >
                          <SelectTrigger className="w-28 h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="onhold">On Hold</SelectItem>
                            <SelectItem value="missing">Missing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500 mb-2">Notes</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsAddNoteOpen(true)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Note
                  </Button>
                </div>
                {selectedCase.notes && selectedCase.notes.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCase.notes.map((note, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes yet.</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsOpen(false)}
            >
              Close
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleContactUser()}
              >
                Contact User
              </Button>
              {selectedCase?.status !== 'completed' && (
                <Button
                  onClick={() => handleUpdateStatus('completed')}
                >
                  Mark Completed
                </Button>
              )}
              {selectedCase?.status !== 'onhold' && (
                <Button
                  variant="secondary"
                  onClick={() => handleUpdateStatus('onhold')}
                >
                  Put On Hold
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
            <DialogDescription>
              Add a new note to the onboarding case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddNoteOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>
              Add a new document to the onboarding case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Document Name</p>
              <Input
                placeholder="Enter document name"
                value={newDocumentName}
                onChange={(e) => setNewDocumentName(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center p-6 border-2 border-dashed rounded-md">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 10MB)</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDocumentOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDocument}>Add Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OnboardingSupport;
