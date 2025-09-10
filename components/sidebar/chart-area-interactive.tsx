"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive area chart";

const dummyEnrollmentsData = [
  { date: "2024-04-15", enrollments: 12 },
  { date: "2024-04-16", enrollments: 8 },
  { date: "2024-04-17", enrollments: 10 },
  { date: "2024-04-18", enrollments: 22 },
  { date: "2024-04-19", enrollments: 12 },
  { date: "2024-04-20", enrollments: 8 },
  { date: "2024-04-21", enrollments: 12 },
  { date: "2024-04-22", enrollments: 10 },
  { date: "2024-04-23", enrollments: 19 },
  { date: "2024-04-24", enrollments: 32 },
  { date: "2024-04-25", enrollments: 16 },
  { date: "2024-04-26", enrollments: 31 },
  { date: "2024-04-27", enrollments: 15 },
  { date: "2024-04-28", enrollments: 18 },
  { date: "2024-04-29", enrollments: 21 },
  { date: "2024-04-30", enrollments: 29 },
  { date: "2024-05-01", enrollments: 12 },
  { date: "2024-05-02", enrollments: 22 },
  { date: "2024-05-03", enrollments: 20 },
];

const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  data: {
    date: string;
    enrollments: number;
  }[];
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const totalEnrollmentsNumber = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.enrollments, 0),
    [data]
  );

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollments</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days: {totalEnrollmentsNumber}
          </span>
          <span className="@[540px]/card:hidden">
            Last 30 days:{totalEnrollmentsNumber}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data}
            margin={{
              right: 12,
              left: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={"preserveStartEnd"}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="enrollments" fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
