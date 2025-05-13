
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecoveryDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recovery Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Recovery dashboard content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecoveryDashboard;
