
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";
import { CreditCard, BadgeIndianRupee, Users, Target } from "lucide-react";

const salesData = [
  { month: 'Jan', healthCards: 45, loans: 22 },
  { month: 'Feb', healthCards: 52, loans: 25 },
  { month: 'Mar', healthCards: 48, loans: 30 },
  { month: 'Apr', healthCards: 61, loans: 35 },
  { month: 'May', healthCards: 55, loans: 36 },
  { month: 'Jun', healthCards: 67, loans: 32 },
];

const commissionData = [
  { month: 'Jan', amount: 85000 },
  { month: 'Feb', amount: 95000 },
  { month: 'Mar', amount: 87000 },
  { month: 'Apr', amount: 110000 },
  { month: 'May', amount: 102000 },
  { month: 'Jun', amount: 125000 },
];

const SalesOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.6L</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Cards Sold</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">
              +22% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loans Facilitated</CardTitle>
            <BadgeIndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Earned</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹6.04L</div>
            <p className="text-xs text-muted-foreground">
              +18% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Monthly card and loan sales comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="healthCards" name="Health Cards" fill="#8884d8" />
                <Bar dataKey="loans" name="Loans" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Commission Trends</CardTitle>
            <CardDescription>
              Monthly commission earnings in ₹
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={commissionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Commission']} />
                <Legend />
                <Line type="monotone" dataKey="amount" name="Commission" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
          <CardDescription>
            Your most recent leads and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  Vikram Hospitals
                </p>
                <p className="text-sm text-muted-foreground">
                  Interested in Gold and Platinum Health Cards
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Follow-up
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  Sundar Medical Center
                </p>
                <p className="text-sm text-muted-foreground">
                  Loan facility for patients
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Converted
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  LifeCare Hospital
                </p>
                <p className="text-sm text-muted-foreground">
                  Complete health financing solution
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Negotiation
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOverview;
