'use client';

import { useMemo } from 'react';
import { Test, TestResponse } from '@/app/shared/lib/store';
import Link from 'next/link';
import { Button } from '@/app/shared/components/ui/Button';

interface TestPerformanceTableProps {
  tests: Test[];
  responses: TestResponse[];
}

interface TestPerformanceData {
  id: string;
  title: string;
  numQuestions: number;
  numResponses: number;
  averageScore: number;
  averageScorePercentage: number;
  lastSubmission: Date | null;
}

export default function TestPerformanceTable({ tests, responses }: TestPerformanceTableProps) {
  const performanceData = useMemo(() => {
    return tests.map(test => {
      const testResponses = responses.filter(r => r.testId === test.id);
      
      let totalScore = 0;
      let totalMaxScore = 0;
      
      testResponses.forEach(response => {
        if (response.totalScore !== undefined && response.maxPossibleScore) {
          totalScore += response.totalScore;
          totalMaxScore += response.maxPossibleScore;
        }
      });
      
      const averageScore = testResponses.length > 0 ? totalScore / testResponses.length : 0;
      const averageMaxScore = testResponses.length > 0 ? totalMaxScore / testResponses.length : 0;
      const averageScorePercentage = averageMaxScore > 0 
        ? Math.round((averageScore / averageMaxScore) * 100) 
        : 0;
      
      const lastSubmission = testResponses.length > 0 
        ? new Date(Math.max(...testResponses.map(r => new Date(r.submittedAt).getTime())))
        : null;
      
      return {
        id: test.id,
        title: test.title,
        numQuestions: test.questions.length,
        numResponses: testResponses.length,
        averageScore,
        averageScorePercentage,
        lastSubmission
      } as TestPerformanceData;
    })
    .sort((a, b) => b.numResponses - a.numResponses);
  }, [tests, responses]);

  if (performanceData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No test data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Name
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Questions
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Responses
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Avg. Score
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Submission
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {performanceData.map((test) => (
            <tr key={test.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{test.title}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{test.numQuestions}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{test.numResponses}</div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div 
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      test.averageScorePercentage >= 80 ? 'bg-green-100 text-green-800' :
                      test.averageScorePercentage >= 60 ? 'bg-blue-100 text-blue-800' :
                      test.averageScorePercentage >= 40 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {test.averageScorePercentage}%
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {test.lastSubmission 
                    ? new Date(test.lastSubmission).toLocaleDateString() 
                    : 'N/A'}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/edit/${test.id}`}>
                  <Button variant="outline" size="sm" className="mr-2">Edit</Button>
                </Link>
                <Link href={`/preview/${test.id}`}>
                  <Button variant="outline" size="sm">Preview</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 