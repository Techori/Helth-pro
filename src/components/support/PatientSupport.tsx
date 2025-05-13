
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PatientSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Patient support content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientSupport;
