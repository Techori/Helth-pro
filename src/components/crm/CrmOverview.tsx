
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart, Wallet, UserPlus, Users, Calendar } from "lucide-react";

const CrmOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,456</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.4M</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Monthly lead conversion and revenue trends
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center border rounded">
              <LineChart className="h-16 w-16 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Revenue & Conversion Chart</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>
              Distribution of leads by source
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center border rounded">
              <PieChart className="h-16 w-16 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Lead Source Distribution</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>
              Most popular products by customer interest
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex h-[200px] items-center justify-center border rounded">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Product Interest Chart</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest customer interactions and tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[1, 2, 3, 4, 5].map((item) => (
                <li key={item} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="text-sm font-medium">Call with Metro Hospital</p>
                    <p className="text-xs text-muted-foreground">Call scheduled for product demo</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrmOverview;
