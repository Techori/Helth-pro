
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HospitalVisits = () => {
  // Mock data
  const hospitalVisits = [
    {
      visitId: "VIS-123456",
      date: "20/11/2023",
      hospital: "City General Hospital",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      reason: "Annual check-up",
      amount: 3500,
      services: [
        { name: "Consultation", amount: 1000 },
        { name: "ECG Test", amount: 1500 },
        { name: "Blood Test", amount: 1000 },
      ],
      status: "Completed"
    },
    {
      visitId: "VIS-123455",
      date: "15/10/2023",
      hospital: "Medicare Pharmacy",
      doctor: "Dr. Robert Smith",
      department: "General Medicine",
      reason: "Fever and cold",
      amount: 1800,
      services: [
        { name: "Consultation", amount: 800 },
        { name: "Medication", amount: 1000 },
      ],
      status: "Completed"
    },
    {
      visitId: "VIS-123450",
      date: "05/09/2023",
      hospital: "Wellness Clinic",
      doctor: "Dr. Amit Patel",
      department: "Orthopedics",
      reason: "Knee pain",
      amount: 2500,
      services: [
        { name: "Consultation", amount: 1200 },
        { name: "X-Ray", amount: 1300 },
      ],
      status: "Completed"
    },
    {
      visitId: "VIS-123445",
      date: "10/08/2023",
      hospital: "City General Hospital",
      doctor: "Dr. Mary Wilson",
      department: "ENT",
      reason: "Throat infection",
      amount: 1200,
      services: [
        { name: "Consultation", amount: 1000 },
        { name: "Medication", amount: 200 },
      ],
      status: "Completed"
    }
  ];

  const upcomingAppointments = [
    {
      appointmentId: "AP-123456",
      date: "10/12/2023",
      time: "10:30 AM",
      hospital: "City General Hospital",
      doctor: "Dr. Sarah Johnson",
      department: "Cardiology",
      reason: "Follow-up check-up",
      status: "Confirmed"
    },
    {
      appointmentId: "AP-123455",
      date: "18/12/2023",
      time: "02:00 PM",
      hospital: "Wellness Clinic",
      doctor: "Dr. Amit Patel",
      department: "Orthopedics",
      reason: "Knee therapy session",
      status: "Scheduled"
    }
  ];

  const handleDownloadInvoice = (visitId: string) => {
    toast({
      title: "Invoice Download",
      description: `Invoice for visit ${visitId} is being downloaded.`,
    });
  };

  const handleBookAppointment = () => {
    toast({
      title: "Book Appointment",
      description: "Redirecting to appointment booking page.",
    });
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    toast({
      title: "Reschedule Appointment",
      description: `Redirecting to reschedule appointment ${appointmentId}.`,
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    toast({
      title: "Cancel Appointment",
      description: `Are you sure you want to cancel appointment ${appointmentId}?`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled medical appointments</CardDescription>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div 
                  key={appointment.appointmentId} 
                  className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="space-y-2 mb-4 md:mb-0">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium">{appointment.date} at {appointment.time}</span>
                    </div>
                    <h4 className="font-semibold">{appointment.hospital}</h4>
                    <p className="text-sm text-muted-foreground">
                      {appointment.doctor} • {appointment.department}
                    </p>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRescheduleAppointment(appointment.appointmentId)}
                    >
                      Reschedule
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleCancelAppointment(appointment.appointmentId)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No upcoming appointments</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleBookAppointment} className="w-full">Book New Appointment</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Visit History</CardTitle>
          <CardDescription>Your past medical visits and treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {hospitalVisits.map((visit) => (
              <AccordionItem key={visit.visitId} value={visit.visitId}>
                <AccordionTrigger>
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full pr-4 text-left">
                    <div className="flex-1">
                      <p className="font-medium">{visit.date} - {visit.hospital}</p>
                      <p className="text-sm text-muted-foreground">{visit.doctor} • {visit.department}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="font-medium text-right">₹{visit.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 pb-4 px-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Visit ID</p>
                        <p className="font-medium">{visit.visitId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Reason for Visit</p>
                        <p className="font-medium">{visit.reason}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Services</p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {visit.services.map((service, index) => (
                            <TableRow key={index}>
                              <TableCell>{service.name}</TableCell>
                              <TableCell className="text-right">₹{service.amount.toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell className="font-bold">Total</TableCell>
                            <TableCell className="text-right font-bold">₹{visit.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(visit.visitId)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="ml-auto">View All Hospital Visits</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HospitalVisits;
