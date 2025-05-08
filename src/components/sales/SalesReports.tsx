
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, LineChart, BarChart, PieChart } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { FileDown, Calendar, Filter, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReportCard from "../reports/ReportCard";

const SalesReports = () => {
  const [reportPeriod, setReportPeriod] = useState("month");
  const [isLoading, setIsLoading] = useState(false);
  
  // Sample data for charts
  const salesTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Health Cards",
        data: [45, 52, 48, 61, 55, 67],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      },
      {
        label: "Loans",
        data: [22, 25, 30, 35, 36, 32],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1
      }
    ]
  };
  
  const productPerformanceData = {
    labels: ["Gold Card", "Silver Card", "Bronze Card", "Medical Loan", "Surgery Loan"],
    datasets: [
      {
        label: "Sales (Qty)",
        data: [120, 190, 260, 150, 110],
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
  
  const teamPerformanceData = {
    labels: ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"],
    datasets: [
      {
        label: "Target Achieved (%)",
        data: [87, 95, 72, 88, 79],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };
  
  const conversionRateData = {
    labels: ["Direct", "Partner Referral", "Hospital Referral", "Marketing Campaign", "Online"],
    datasets: [
      {
        label: "Conversion Rate",
        data: [35, 45, 60, 25, 30],
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

  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View and analyze sales performance metrics and trends
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
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
          
          <Button variant="outline" size="icon" className="mr-2">
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" className="mr-2">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="performance">
        <TabsList className="mb-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹18.32L</div>
                <p className="text-xs text-muted-foreground">+12% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cards Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">482</div>
                <p className="text-xs text-muted-foreground">+8% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Loans Facilitated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">267</div>
                <p className="text-xs text-muted-foreground">+15% from previous period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <ReportCard
            title="Sales Trend Analysis"
            description="Monthly product sales comparison"
            footer={
              <CardFooter className="flex justify-between">
                <div className="text-xs text-muted-foreground">
                  Last 6 months data
                </div>
                <Button variant="outline" size="sm">
                  <FileDown className="h-4 w-4 mr-2" /> Export
                </Button>
              </CardFooter>
            }
          >
            <LineChart data={salesTrendData} />
          </ReportCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportCard
              title="Team Performance"
              description="Target achievement by zone"
            >
              <BarChart data={teamPerformanceData} />
            </ReportCard>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest achieving sales executives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-blue-100 mr-3 flex items-center justify-center">
                      <span className="text-blue-700 font-medium">AM</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Amit Patel</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Corporate Sales</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">115% Target</Badge>
                      </div>
                    </div>
                    <div className="text-xl font-bold">₹3.2L</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-purple-100 mr-3 flex items-center justify-center">
                      <span className="text-purple-700 font-medium">DS</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Deepika Shah</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>West Zone</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">108% Target</Badge>
                      </div>
                    </div>
                    <div className="text-xl font-bold">₹2.8L</div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-amber-100 mr-3 flex items-center justify-center">
                      <span className="text-amber-700 font-medium">MS</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Meera Singh</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>North Zone</span>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">102% Target</Badge>
                      </div>
                    </div>
                    <div className="text-xl font-bold">₹2.5L</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products">
          <ReportCard
            title="Product Performance Analysis"
            description="Comparison of sales performance by product"
            className="h-[450px]"
          >
            <BarChart data={productPerformanceData} />
          </ReportCard>
        </TabsContent>

        <TabsContent value="conversion">
          <ReportCard
            title="Lead Conversion Analysis"
            description="Conversion rates by lead source"
            className="h-[450px]"
          >
            <PieChart data={conversionRateData} />
          </ReportCard>
        </TabsContent>

        <TabsContent value="commission">
          <ReportCard
            title="Commission Earnings"
            description="Monthly commission trends"
            className="h-[450px]"
          >
            <LineChart 
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                datasets: [
                  {
                    label: "Commission Earned",
                    data: [85000, 95000, 87000, 110000, 102000, 125000],
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
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

export default SalesReports;
