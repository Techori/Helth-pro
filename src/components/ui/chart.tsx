
"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartProps {
  data: any;
  className?: string;
}

export function LineChart({ data, className }: ChartProps) {
  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data?.datasets ? [] : data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data?.datasets ? (
            data.datasets.map((dataset: any, index: number) => (
              <Line
                key={index}
                type="monotone"
                dataKey={dataset.label}
                data={data.labels.map((label: string, i: number) => ({
                  name: label,
                  [dataset.label]: dataset.data[i],
                }))}
                stroke={dataset.borderColor}
                fill={dataset.backgroundColor}
                activeDot={{ r: 8 }}
              />
            ))
          ) : (
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          )}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data, className }: ChartProps) {
  if (!data) return null;

  // If the data is in Chart.js format, convert it to a format that recharts can use
  const formattedData = data.labels
    ? data.labels.map((label: string, index: number) => {
        const entry: Record<string, any> = { name: label };
        data.datasets.forEach((dataset: any) => {
          entry[dataset.label] = dataset.data[index];
        });
        return entry;
      })
    : data;

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {data.datasets
            ? data.datasets.map((dataset: any, index: number) => (
                <Bar
                  key={index}
                  dataKey={dataset.label}
                  fill={dataset.backgroundColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`}
                />
              ))
            : Object.keys(formattedData[0] || {})
                .filter((key) => key !== "name")
                .map((key, index) => (
                  <Bar
                    key={index}
                    dataKey={key}
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PieChart({ data, className }: ChartProps) {
  if (!data || !data.datasets) return null;

  const dataset = data.datasets[0];
  const formattedData = data.labels.map((label: string, index: number) => ({
    name: label,
    value: dataset.data[index],
  }));
  
  const COLORS = dataset.backgroundColor || [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#83a6ed",
  ];

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Add the missing chart components
interface ChartContainerProps {
  children: React.ReactNode;
  config?: any;
  className?: string;
}

export function ChartContainer({ children, config, className }: ChartContainerProps) {
  return (
    <div
      className={className}
      style={
        {
          "--color-users": config?.users?.theme?.light || "#8B5CF6",
          "--color-loans": config?.loans?.theme?.light || "#16a34a",
          "--color-transactions": config?.transactions?.theme?.light || "#4f46e5",
          "--color-amount": config?.amount?.theme?.light || "#16a34a",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function ChartLegend({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center space-x-4">{children}</div>;
}

export function ChartLegendContent() {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-1">
        <div className="h-3 w-3 rounded-full bg-[var(--color-users)]" />
        <span className="text-sm text-muted-foreground">Users</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="h-3 w-3 rounded-full bg-[var(--color-loans)]" />
        <span className="text-sm text-muted-foreground">Loans</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="h-3 w-3 rounded-full bg-[var(--color-transactions)]" />
        <span className="text-sm text-muted-foreground">Transactions</span>
      </div>
      <div className="flex items-center space-x-1">
        <div className="h-3 w-3 rounded-full bg-[var(--color-amount)]" />
        <span className="text-sm text-muted-foreground">Amount</span>
      </div>
    </div>
  );
}

export function ChartTooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function ChartTooltipContent({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-md">
        <div className="grid grid-cols-2 gap-2">
          <div className="font-medium">{label}</div>
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium">{item.name}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
