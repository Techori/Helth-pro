
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, LineChart } from "recharts";
import { UserPlus, DollarSign, Target } from "lucide-react";
import ReportCard from "../reports/ReportCard";

const referralData = [
  { month: 'Jan', patients: 5, hospitals: 2 },
  { month: 'Feb', patients: 7, hospitals: 1 },
  { month: 'Mar', patients: 6, hospitals: 2 },
  { month: 'Apr', patients: 9, hospitals: 3 },
  { month: 'May', patients: 8, hospitals: 2 },
  { month: 'Jun', patients: 12, hospitals: 3 },
];

const commissionData = [
  { month: 'Jan', amount: 25000 },
  { month: 'Feb', amount: 32000 },
  { month: 'Mar', amount: 28000 },
  { month: 'Apr', amount: 45000 },
  { month: 'May', amount: 38000 },
  { month: 'Jun', amount: 60000 },
];

interface AgentProps {
  agentData: {
    name: string;
    id: string;
    phone: string;
    location: string;
    totalReferrals: number;
    conversionRate: number;
    totalEarnings: number;
    pendingPayouts: number;
  };
}

const AgentOverview = ({ agentData }: AgentProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentData.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentData.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(agentData.totalEarnings / 100000).toFixed(2)}L</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(agentData.pendingPayouts / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              To be credited by 10th
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ReportCard title="Referral Overview" description="Monthly referrals by type">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={referralData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" name="Patient Referrals" fill="#8884d8" />
              <Bar dataKey="hospitals" name="Hospital Referrals" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Commission Trends" description="Monthly commission earnings in ₹">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={commissionData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Commission']} />
              <Legend />
              <Line type="monotone" dataKey="amount" name="Commission" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <UserPlus className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  Sanjay Mehta
                </p>
                <p className="text-sm text-muted-foreground">
                  Patient referral for Platinum Health Card
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Converted
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <UserPlus className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  LifeCare Hospital
                </p>
                <p className="text-sm text-muted-foreground">
                  Hospital onboarding referral
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                In Process
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-4">
                <UserPlus className="h-5 w-5 text-blue-700" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none">
                  Priya Patel
                </p>
                <p className="text-sm text-muted-foreground">
                  Patient referral for medical loan
                </p>
              </div>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Converted
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentOverview;
