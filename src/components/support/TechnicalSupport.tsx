
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TechnicalSupport: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Technical Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Technical support content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSupport;
