'use client';

import { useEffect, useState } from 'react';
import { Test, TestResponse } from '@/app/shared/lib/store';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestCompletionsChartProps {
  tests: Test[];
  responses: TestResponse[];
}

export default function TestCompletionsChart({ tests, responses }: TestCompletionsChartProps) {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Completions',
        data: [] as number[],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  });

  useEffect(() => {
    // Limit to the 10 most recent tests for better visualization
    const recentTests = [...tests]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .reverse();
    
    const labels = recentTests.map(test => test.title.length > 20 
      ? `${test.title.substring(0, 20)}...` 
      : test.title);
    
    const completionData = recentTests.map(test => {
      return responses.filter(response => response.testId === test.id).length;
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Completions',
          data: completionData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    });
  }, [tests, responses]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar options={options} data={chartData} />;
} 