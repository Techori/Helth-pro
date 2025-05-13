
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KycSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>KYC support content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KycSupport;
