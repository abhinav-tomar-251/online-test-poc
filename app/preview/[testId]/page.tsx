"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTestStore, QuestionType } from "@/app/shared/lib/store";
import { Button } from "@/app/shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/shared/components/ui/Card";
import renderQuestionPreview from "../component/RenderQuestionPreview";
import * as React from "react";

export default function PreviewTest({ params }: { params: any }) {
  const unwrappedParams = React.use(params) as { testId: string };
  const testId = unwrappedParams.testId;
  const { setActiveTest, activeTest } = useTestStore();

  useEffect(() => {
    setActiveTest(testId);
    return () => setActiveTest(null);
  }, [testId, setActiveTest]);

  if (!activeTest) {
    return (
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Test not found</h2>
          <p className="text-gray-500 mb-8">The test you're trying to preview doesn't exist.</p>
          <Link href="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href={`/edit/${testId}`}>
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Editor
              </Button>
            </Link>
            <h1 className="text-2xl font-bold ml-2">Test Preview</h1>
          </div>
          <div className="flex gap-3">
            <Link href={`/take/${testId}`}>
              <Button variant="primary">Take Test</Button>
            </Link>
            <Link href={`/edit/${testId}`}>
              <Button variant="outline">Edit Test</Button>
            </Link>
          </div>
        </div>

        <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-md">
          <p className="text-amber-700">
            <span className="font-medium">Preview Mode:</span> This is how the test will appear to test takers. This preview contains all questions on one page for your review.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{activeTest.title}</CardTitle>
            {activeTest.description && (
              <CardDescription className="text-gray-600 mt-2">{activeTest.description}</CardDescription>
            )}
          </CardHeader>
        </Card>

        {activeTest.questions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-500">No questions yet</h3>
            <p className="text-gray-400 mt-2 mb-4">Add questions to your test to see a preview</p>
            <Link href={`/edit/${testId}`}>
              <Button variant="primary">Add Questions</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTest.questions.map((question, index) => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <div className="mb-2 flex items-baseline">
                    <span className="text-gray-500 text-sm mr-2">Q{index + 1}.</span>
                    <h2 className="text-lg font-medium">
                      {question.title}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </h2>
                  </div>

                  {question.type === QuestionType.Section && (question as any).description && (
                    <p className="text-gray-600 mt-1 ml-6">{(question as any).description}</p>
                  )}

                  <div className="mt-4 ml-6">
                    {renderQuestionPreview(question)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
