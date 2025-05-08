
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart, PieChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { FileDown, Filter } from "lucide-react";
import ReportCard from "../reports/ReportCard";

const HospitalReports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  
  // Sample data for charts
  const patientTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Patient Admissions",
        data: [65, 78, 52, 91, 89, 107],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };
  
  const revenueSourceData = {
    labels: ["OPD", "IPD", "Pharmacy", "Diagnostics", "Health Cards", "Loans"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [240000, 390000, 150000, 220000, 120000, 80000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
      }
    ]
  };
  
  const healthCardUsageData = {
    labels: ["Bronze", "Silver", "Gold", "Platinum", "Family"],
    datasets: [
      {
        label: "Active Cards",
        data: [220, 190, 150, 80, 120],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Hospital Analytics</h2>
          <p className="text-muted-foreground">
            Review performance metrics and patient trends
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="patients">
        <TabsList className="mb-6">
          <TabsTrigger value="patients">Patient Metrics</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="cards">Health Cards</TabsTrigger>
          <TabsTrigger value="loans">Loan Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14,586</div>
                <p className="text-xs text-muted-foreground">+8% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">OPD Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,243</div>
                <p className="text-xs text-muted-foreground">+12% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">IPD Admissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">386</div>
                <p className="text-xs text-muted-foreground">+5% from last period</p>
              </CardContent>
            </Card>
          </div>

          <ReportCard 
            title="Patient Trends" 
            description="Monthly patient admission statistics"
            footer={
              <CardFooter className="pt-4 flex justify-between">
                <div className="text-xs text-muted-foreground">Last 6 months data</div>
                <Button variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" /> Export
                </Button>
              </CardFooter>
            }
          >
            <LineChart data={patientTrendData} />
          </ReportCard>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-6">
          <ReportCard 
            title="Revenue Sources" 
            description="Distribution of revenue by department"
          >
            <PieChart data={revenueSourceData} />
          </ReportCard>
        </TabsContent>
        
        <TabsContent value="cards" className="space-y-6">
          <ReportCard 
            title="Health Card Distribution" 
            description="Active health cards by type"
          >
            <BarChart data={healthCardUsageData} />
          </ReportCard>
        </TabsContent>
        
        <TabsContent value="loans" className="space-y-6">
          <ReportCard 
            title="Loan Facilitation Performance" 
            description="Monthly loan approvals and disbursements"
          >
            <LineChart 
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Loans Approved",
                    data: [25, 32, 28, 37, 42, 45],
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                  },
                  {
                    label: "Amount Disbursed (₹ Lakhs)",
                    data: [12.5, 16.0, 14.0, 18.5, 21.0, 22.5],
                    borderColor: "rgb(255, 99, 132)",
                    tension: 0.1
                  }
                ]
              }}
            />
          </ReportCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalReports;
