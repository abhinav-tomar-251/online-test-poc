"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTestStore, QuestionType, Question, QuestionResponse } from "@/app/shared/lib/store";
import { Button } from "@/app/shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/shared/components/ui/Card";
import { ChoiceQuestionComponent, DateQuestionComponent, LikertQuestionComponent, NetPromoterScoreComponent, RankingQuestionComponent, RatingQuestionComponent, SectionComponent, TextQuestionComponent, UploadFileQuestionComponent } from "../component/QuestionComponents";
import * as React from "react";

export default function TakeTest({ params }: { params: any }) {
  const router = useRouter();
  const unwrappedParams = React.use(params) as { testId: string };
  const testId = unwrappedParams.testId;
  const { tests, setActiveTest, activeTest, saveResponse } = useTestStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [showSummary, setShowSummary] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setActiveTest(testId);
    return () => setActiveTest(null);
  }, [testId, setActiveTest]);

  if (!activeTest) {
    return (
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Test not found</h2>
          <p className="text-gray-500 mb-8">The test you're trying to take doesn't exist.</p>
          <Link href="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  const questions = activeTest.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    
    if (value !== undefined && value !== null && value !== "") {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentQuestion = () => {
    if (!currentQuestion.required) return true;
    
    const response = responses[currentQuestion.id];
    
    if (response === undefined || response === null || response === "") {
      setValidationErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: "This question is required",
      }));
      return false;
    }
    
    if (currentQuestion.type === QuestionType.Choice && Array.isArray(response) && response.length === 0) {
      setValidationErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: "This question is required",
      }));
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentQuestion()) return;
    
    if (isLastQuestion) {
      setShowSummary(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const responseArray: QuestionResponse[] = Object.entries(responses).map(
      ([questionId, value]) => ({
        questionId,
        value,
      })
    );
    
    saveResponse(testId, responseArray);
    setSubmitted(true);
  };

  const renderQuestionComponent = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case QuestionType.Choice:
        return (
          <ChoiceQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || (currentQuestion.allowMultiple ? [] : "")}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );
        
      case QuestionType.Text:
        return (
          <TextQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || ""}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );
        
      case QuestionType.Rating:
        return (
          <RatingQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || 0}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );
        
      case QuestionType.Date:
        return (
          <DateQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || ""}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );
        
      case QuestionType.Ranking:
        return (
          <RankingQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || []}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );

      case QuestionType.Likert:
        return (
          <LikertQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || {}}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );

      case QuestionType.UploadFile:
        return (
          <UploadFileQuestionComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || null}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );

      case QuestionType.NetPromoterScore:
        return (
          <NetPromoterScoreComponent
            question={currentQuestion}
            value={responses[currentQuestion.id] || 0}
            onChange={(value) => handleResponseChange(currentQuestion.id, value)}
          />
        );
        
      case QuestionType.Section:
        return (
          <SectionComponent
            question={currentQuestion}
          />
        );

      default:
        return (
          <div className="py-4 text-gray-500 italic">
            This question type is not yet implemented.
          </div>
        );
    }
  };

  if (submitted) {
    const response = useTestStore.getState().responses.slice(-1)[0]; // Get the most recent response
    const hasScore = response?.totalScore !== undefined && response?.maxPossibleScore !== undefined;
    const scorePercentage = hasScore ? Math.round((response.totalScore! / response.maxPossibleScore!) * 100) : 0;
    
    return (
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Test Submitted</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-xl font-medium mb-2">Thank you for completing the test!</p>
              
              {hasScore && (
                <div className="my-6">
                  <div className="text-3xl font-bold mb-1">
                    {response.totalScore} / {response.maxPossibleScore} points
                  </div>
                  <div className="text-lg mb-4">
                    {scorePercentage}% Score
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div
                      className={`h-4 rounded-full ${
                        scorePercentage >= 70 
                          ? 'bg-green-500' 
                          : scorePercentage >= 40 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${scorePercentage}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {scorePercentage >= 70 
                      ? 'Great job! You performed very well on this test.' 
                      : scorePercentage >= 40 
                        ? 'Good effort! There is still room for improvement.' 
                        : 'You might want to review the material and try again.'}
                  </p>
                </div>
              )}
              
              <p className="text-gray-500 mb-8">Your responses have been recorded.</p>
              <Link href="/">
                <Button variant="primary">Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (showSummary) {
    return (
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Exit
                </Button>
              </Link>
              <h1 className="text-2xl font-bold ml-2">Review Your Answers</h1>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{activeTest.title}</CardTitle>
              {activeTest.description && (
                <CardDescription>{activeTest.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {questions.map((question, index) => {
                  if (question.type === QuestionType.Section) {
                    return (
                      <div key={question.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-medium mb-2">{question.title}</h3>
                        {question.description && <p className="text-gray-600">{question.description}</p>}
                      </div>
                    );
                  }
                  
                  let responseDisplay = "Not answered";
                  const response = responses[question.id];
                  
                  if (response !== undefined) {
                    if (question.type === QuestionType.Choice) {
                      if ((question as any).allowMultiple && Array.isArray(response)) {
                        const options = (question as any).options;
                        responseDisplay = response.map(id => 
                          options.find((opt: any) => opt.id === id)?.text
                        ).join(", ");
                      } else {
                        const options = (question as any).options;
                        const option = options.find((opt: any) => opt.id === response);
                        responseDisplay = option?.text || "Invalid response";
                      }
                    } else if (question.type === QuestionType.Rating || question.type === QuestionType.NetPromoterScore) {
                      responseDisplay = `Rating: ${response}`;
                    } else if (question.type === QuestionType.Ranking && Array.isArray(response)) {
                      const options = (question as any).options;
                      responseDisplay = response.map((id, index) => {
                        const option = options.find((opt: any) => opt.id === id);
                        return `${index + 1}. ${option?.text || 'Unknown'}`;
                      }).join("\n");
                    } else if (question.type === QuestionType.Likert && typeof response === 'object') {
                      const statements = (question as any).statements;
                      const scale = (question as any).scale;
                      responseDisplay = Object.entries(response).map(([stmtId, scaleId]) => {
                        const statement = statements.find((s: any) => s.id === stmtId)?.text || 'Unknown';
                        const scaleValue = scale.find((s: any) => s.id === scaleId)?.text || 'Unknown';
                        return `${statement}: ${scaleValue}`;
                      }).join("\n");
                    } else if (question.type === QuestionType.UploadFile && response) {
                      responseDisplay = `File: ${response.name || 'Uploaded file'}`;
                    } else if (typeof response === "string") {
                      responseDisplay = response;
                    } else if (typeof response === "number") {
                      responseDisplay = response.toString();
                    } else {
                      responseDisplay = JSON.stringify(response);
                    }
                  }
                  
                  return (
                    <div key={question.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">
                          {index + 1}. {question.title}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <button
                          onClick={() => setCurrentQuestionIndex(index)}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <p className="text-gray-700 whitespace-pre-line">{responseDisplay}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                Back to Questions
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit Test
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex items-start mb-10">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Exit
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-8">{activeTest.title}</h1>
      </div>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="mb-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-1">
                  {currentQuestion.title}
                  {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
                </h2>
                {currentQuestion.type === QuestionType.Section && currentQuestion.description && (
                  <p className="text-gray-600">{currentQuestion.description}</p>
                )}
                {validationErrors[currentQuestion.id] && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors[currentQuestion.id]}</p>
                )}
              </div>
              
              {renderQuestionComponent()}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-4 pb-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button variant="primary" onClick={handleNext}>
              {isLastQuestion ? "Review Answers" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

