'use client';

import { useEffect, useState } from 'react';
import { TestResponse } from '@/app/shared/lib/store';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface ScoreDistributionChartProps {
  responses: TestResponse[];
}

export default function ScoreDistributionChart({ responses }: ScoreDistributionChartProps) {
  const [chartData, setChartData] = useState({
    labels: ['0-20%', '21-40%', '41-60%', '61-80%', '81-100%'],
    datasets: [
      {
        label: 'Responses',
        data: [0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 205, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    // Skip responses without score information
    const validResponses = responses.filter(
      response => response.totalScore !== undefined && response.maxPossibleScore && response.maxPossibleScore > 0
    );

    // Initialize score buckets
    const scoreBuckets = [0, 0, 0, 0, 0];
    
    // Categorize scores into buckets (0-20%, 21-40%, etc.)
    validResponses.forEach(response => {
      const scorePercentage = response.totalScore! / response.maxPossibleScore! * 100;
      
      if (scorePercentage <= 20) {
        scoreBuckets[0]++;
      } else if (scorePercentage <= 40) {
        scoreBuckets[1]++;
      } else if (scorePercentage <= 60) {
        scoreBuckets[2]++;
      } else if (scorePercentage <= 80) {
        scoreBuckets[3]++;
      } else {
        scoreBuckets[4]++;
      }
    });

    setChartData(prev => ({
      ...prev,
      datasets: [
        {
          ...prev.datasets[0],
          data: scoreBuckets,
        }
      ]
    }));
  }, [responses]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${value} responses (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Pie options={options} data={chartData} />;
} 