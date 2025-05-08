
"use client";

import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { ReactNode } from "react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

// Base options for charts
const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        boxWidth: 10,
        usePointStyle: true,
      },
    },
  },
};

interface ChartProps {
  data: {
    labels: string[];
    datasets: any[];
  };
  options?: any;
}

// Adding the missing components that are referenced in other files
interface ChartContainerProps {
  config?: Record<string, any>;
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ config, children, className }: ChartContainerProps) {
  return (
    <div className={`w-full ${className || ''}`}>
      {children}
    </div>
  );
}

interface ChartLegendProps {
  content?: ReactNode;
}

export function ChartLegend({ content }: ChartLegendProps) {
  return <div className="flex justify-center mt-2">{content}</div>;
}

export function ChartLegendContent() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
        <span className="text-sm">Dataset 1</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
        <span className="text-sm">Dataset 2</span>
      </div>
    </div>
  );
}

export function ChartTooltip({ content }: { content: ReactNode }) {
  return <>{content}</>;
}

export function ChartTooltipContent() {
  return <div className="bg-white p-2 rounded shadow text-xs"></div>;
}

export function BarChart({ data, options = {} }: ChartProps) {
  return (
    <Bar
      data={data}
      options={{
        ...baseOptions,
        ...options,
      }}
    />
  );
}

export function LineChart({ data, options = {} }: ChartProps) {
  return (
    <Line
      data={data}
      options={{
        ...baseOptions,
        ...options,
      }}
    />
  );
}

export function PieChart({ data, options = {} }: ChartProps) {
  return (
    <Pie
      data={data}
      options={{
        ...baseOptions,
        ...options,
      }}
    />
  );
}
