
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart, PieChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Download } from "lucide-react";
import ReportCard from "../reports/ReportCard";

const AdminReports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  
  // Sample data for charts
  const platformGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Hospitals",
        data: [12, 15, 18, 22, 25, 28],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      },
      {
        label: "Patients",
        data: [1200, 1850, 2400, 3100, 3850, 4500],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1
      }
    ]
  };
  
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Platform Revenue (₹ Lakhs)",
        data: [18, 22, 25, 32, 38, 45],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };
  
  const serviceDistributionData = {
    labels: ["Health Cards", "Medical Loans", "Hospital Integration", "Payment Processing", "Other Services"],
    datasets: [
      {
        label: "Revenue (%)",
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Analytics</h2>
          <p className="text-muted-foreground">
            Review overall platform performance and metrics
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
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="growth">
        <TabsList className="mb-6">
          <TabsTrigger value="growth">Platform Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Hospitals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">286</div>
                <p className="text-xs text-muted-foreground">+12% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Registered Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18,742</div>
                <p className="text-xs text-muted-foreground">+24% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Health Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,385</div>
                <p className="text-xs text-muted-foreground">+18% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Loans Facilitated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,286</div>
                <p className="text-xs text-muted-foreground">+15% from last period</p>
              </CardContent>
            </Card>
          </div>

          <ReportCard 
            title="Platform Growth Metrics" 
            description="Hospital and patient registration trends"
          >
            <LineChart data={platformGrowthData} />
          </ReportCard>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <ReportCard 
            title="Platform Revenue" 
            description="Monthly revenue trends"
          >
            <BarChart data={revenueData} />
          </ReportCard>
          
          <ReportCard 
            title="Revenue by Service Type" 
            description="Distribution of revenue across different services"
          >
            <PieChart data={serviceDistributionData} />
          </ReportCard>
        </TabsContent>
        
        <TabsContent value="operations" className="space-y-6">
          <ReportCard 
            title="Operational Metrics" 
            description="Platform performance and uptime"
          >
            <LineChart 
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Uptime (%)",
                    data: [99.8, 99.9, 99.7, 99.95, 99.8, 99.9],
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                  },
                  {
                    label: "Response Time (ms)",
                    data: [320, 315, 350, 310, 300, 290],
                    borderColor: "rgb(255, 99, 132)",
                    tension: 0.1
                  }
                ]
              }}
            />
          </ReportCard>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-6">
          <ReportCard 
            title="Compliance Report" 
            description="Regulatory compliance metrics"
          >
            <BarChart 
              data={{
                labels: ["Data Security", "KYC Compliance", "HIPAA", "Financial Regulations", "Document Retention"],
                datasets: [
                  {
                    label: "Compliance Score (%)",
                    data: [98, 97, 100, 96, 99],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
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

export default AdminReports;
