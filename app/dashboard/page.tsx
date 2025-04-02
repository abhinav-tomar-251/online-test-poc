"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTestStore, TestResponse, Test } from "@/app/shared/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/shared/components/ui/Card";
import { Button } from "@/app/shared/components/ui/Button";
import QuestionTypeAnalysis from "./components/QuestionTypeAnalysis";
import SummaryMetrics from "./components/SummaryMetrics";
import TestCompletionsChart from "./components/TestCompletionsChart";
import ScoreDistributionChart from "./components/ScoreDistributionChart";
import TestPerformanceTable from "./components/TestPerformanceTable";

export default function Dashboard() {
  const { tests, responses, getResponsesForTest } = useTestStore();
  const [analytics, setAnalytics] = useState({
    totalTests: 0,
    totalCompletions: 0,
    averageScore: 0,
    completionRate: 0,
  });

  useEffect(() => {
    // Calculate analytics data
    const totalTests = tests.length;
    const totalCompletions = responses.length;
    
    let totalScorePercent = 0;
    let testsWithResponses = 0;
    
    tests.forEach(test => {
      const testResponses = getResponsesForTest(test.id);
      if (testResponses.length > 0) {
        testsWithResponses++;
        testResponses.forEach(response => {
          if (response.totalScore !== undefined && response.maxPossibleScore) {
            totalScorePercent += (response.totalScore / response.maxPossibleScore) * 100;
          }
        });
      }
    });
    
    const averageScore = totalCompletions > 0 
      ? Math.round((totalScorePercent / totalCompletions) * 10) / 10
      : 0;
      
    const completionRate = testsWithResponses > 0 
      ? Math.round((testsWithResponses / totalTests) * 100) 
      : 0;
    
    setAnalytics({
      totalTests,
      totalCompletions,
      averageScore,
      completionRate,
    });
  }, [tests, responses, getResponsesForTest]);

  // If no tests available, show a placeholder dashboard
  if (tests.length === 0) {
    return (
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <header className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
              <p className="text-gray-600">View performance metrics and test analytics</p>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Return Home
              </Button>
            </Link>
          </div>
        </header>

        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-500">No tests available</h3>
          <p className="text-gray-400 mt-2 mb-4">Create your first test to see analytics</p>
          <Link href="/create">
            <Button variant="primary">Create New Test</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <header className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">View performance metrics and test analytics</p>
          </div>
          <div className="flex gap-3">
            <Link href="/create">
              <Button variant="primary" size="sm">
                Create Test
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Summary Metrics */}
      <SummaryMetrics analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Test Completions Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Test Completions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <TestCompletionsChart tests={tests} responses={responses} />
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ScoreDistributionChart responses={responses} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Question Type Analysis */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Question Type Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <QuestionTypeAnalysis tests={tests} />
            </div>
          </CardContent>
        </Card>

        {/* For future expansion - maybe add a heat map or another chart here */}
      </div>
      
      {/* Test Performance Table */}
      <Card className="shadow-sm mb-10">
        <CardHeader className="pb-2">
          <CardTitle>Test Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <TestPerformanceTable tests={tests} responses={responses} />
        </CardContent>
      </Card>
    </main>
  );
} 