
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { ReactNode } from "react";

interface ReportCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

const ReportCard = ({ title, description, children, className, footer }: ReportCardProps) => {
  return (
    <Card className={`border-brand-100 ${className || ""}`}>
      <CardHeader className="bg-gradient-to-r from-white to-brand-50/30 rounded-t-xl">
        <CardTitle className="text-gray-900">{title}</CardTitle>
        {description && <CardDescription className="text-gray-600">{description}</CardDescription>}
      </CardHeader>
      <CardContent className={className?.includes("h-") ? "" : "h-[300px]"}>
        <ChartContainer>
          {children}
        </ChartContainer>
      </CardContent>
      {footer && <CardFooter className="bg-gray-50/50 border-t border-brand-100/30">{footer}</CardFooter>}
    </Card>
  );
};

export default ReportCard;
