'use client';

import { useMemo } from 'react';
import { Test, QuestionType } from '@/app/shared/lib/store';
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

interface QuestionTypeAnalysisProps {
  tests: Test[];
}

export default function QuestionTypeAnalysis({ tests }: QuestionTypeAnalysisProps) {
  // Get the human-readable name for a question type
  const getQuestionTypeName = (type: QuestionType): string => {
    switch (type) {
      case QuestionType.Choice: return "Choice";
      case QuestionType.Text: return "Text";
      case QuestionType.Rating: return "Rating";
      case QuestionType.Date: return "Date";
      case QuestionType.Ranking: return "Ranking";
      case QuestionType.Likert: return "Likert";
      case QuestionType.UploadFile: return "File Upload";
      case QuestionType.NetPromoterScore: return "NPS";
      case QuestionType.Section: return "Section";
      default: return "Unknown";
    }
  };

  // Calculate question type distribution
  const data = useMemo(() => {
    const typeCount: Record<QuestionType, number> = {
      [QuestionType.Choice]: 0,
      [QuestionType.Text]: 0,
      [QuestionType.Rating]: 0,
      [QuestionType.Date]: 0,
      [QuestionType.Ranking]: 0,
      [QuestionType.Likert]: 0,
      [QuestionType.UploadFile]: 0,
      [QuestionType.NetPromoterScore]: 0,
      [QuestionType.Section]: 0,
    };

    // Count question types
    tests.forEach(test => {
      test.questions.forEach(question => {
        typeCount[question.type]++;
      });
    });

    // Sort by frequency (highest first)
    const sortedTypes = Object.entries(typeCount)
      .sort(([, countA], [, countB]) => countB - countA)
      .filter(([, count]) => count > 0); // Only include types that are actually used

    const labels = sortedTypes.map(([type]) => getQuestionTypeName(type as QuestionType));
    const counts = sortedTypes.map(([, count]) => count);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Questions',
          data: counts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        },
      ],
    };
  }, [tests]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return <Bar options={options} data={data} />;
} 