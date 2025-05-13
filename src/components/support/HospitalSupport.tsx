
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HospitalSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Hospital support content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HospitalSupport;
