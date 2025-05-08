
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, PieChart, LineChart, Download, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReportCard from "../reports/ReportCard";
import { BarChart, LineChart as LineChartComponent, PieChart as PieChartComponent } from "@/components/ui/chart";

const Reporting = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  
  // Sample data for charts
  const salesPerformanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue (₹ Lakhs)",
        data: [42.5, 48.2, 45.8, 52.6, 50.2, 55.8],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };
  
  const leadSourceData = {
    labels: ["Referrals", "Website", "Social Media", "Direct Marketing", "Events", "Partners"],
    datasets: [
      {
        label: "Leads",
        data: [35, 25, 15, 10, 8, 7],
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
  
  const conversionRateData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Lead to Customer (%)",
        data: [18, 20, 22, 25, 24, 28],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Performance metrics and business intelligence for your CRM activities
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
          
          <Button variant="outline" className="flex items-center gap-1">
            <Download className="h-4 w-4 mr-1" />
            Export Reports
          </Button>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="leads">Lead Analytics</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Results</TabsTrigger>
          <TabsTrigger value="activities">Activity Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹42,58,000</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Deals Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1,77,400</div>
                <p className="text-xs text-muted-foreground">
                  +3% from last quarter
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Cycle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38 days</div>
                <p className="text-xs text-muted-foreground">
                  -2 days from last quarter
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ReportCard title="Revenue Trend" description="Monthly revenue performance">
              <LineChartComponent data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Revenue (₹ Lakhs)",
                    data: [35.2, 38.5, 42.1, 45.8, 48.6, 52.3],
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                  }
                ]
              }} />
            </ReportCard>
            
            <ReportCard title="Sales by Product" description="Distribution by product category">
              <PieChartComponent data={{
                labels: ["Health Cards", "Medical Loans", "Insurance", "Wellness Plans", "Others"],
                datasets: [
                  {
                    label: "Sales Volume",
                    data: [45, 30, 15, 5, 5],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.5)',
                      'rgba(54, 162, 235, 0.5)',
                      'rgba(255, 206, 86, 0.5)',
                      'rgba(75, 192, 192, 0.5)',
                      'rgba(153, 102, 255, 0.5)',
                    ],
                  }
                ]
              }} />
            </ReportCard>
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ReportCard title="Lead Source Distribution" description="Where your leads are coming from">
              <PieChartComponent data={leadSourceData} />
            </ReportCard>
            
            <ReportCard title="Lead Conversion Rate" description="Monthly conversion trends">
              <LineChartComponent data={conversionRateData} />
            </ReportCard>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <ReportCard title="Campaign Performance" description="Results by marketing campaign">
            <BarChart data={{
              labels: ["Email Campaign", "Social Media", "Partner Event", "Webinar Series", "Direct Outreach"],
              datasets: [
                {
                  label: "Leads Generated",
                  data: [120, 85, 65, 95, 45],
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                },
                {
                  label: "Conversion Rate (%)",
                  data: [8, 12, 15, 10, 18],
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
              ]
            }} />
          </ReportCard>
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <ReportCard title="Activity Metrics" description="User engagement and productivity metrics">
            <LineChartComponent data={{
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
              datasets: [
                {
                  label: "Calls Made",
                  data: [28, 35, 42, 38, 32],
                  borderColor: "rgb(75, 192, 192)",
                  tension: 0.1
                },
                {
                  label: "Emails Sent",
                  data: [65, 72, 58, 80, 62],
                  borderColor: "rgb(255, 99, 132)",
                  tension: 0.1
                },
                {
                  label: "Meetings Scheduled",
                  data: [12, 15, 10, 14, 8],
                  borderColor: "rgb(255, 206, 86)",
                  tension: 0.1
                }
              ]
            }} />
          </ReportCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reporting;
