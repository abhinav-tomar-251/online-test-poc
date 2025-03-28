"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTestStore, QuestionType, Question, QuestionResponse } from "@/lib/store";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/Card";

export default function TakeTest({ params }: { params: { testId: string } }) {
  const router = useRouter();
  const { testId } = params;
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
    
    // Clear validation error if value is provided
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
    // Convert responses object to array format for store
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
            value={responses[currentQuestion.id] || []}
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
        
      case QuestionType.Section:
        return (
          <SectionComponent
            question={currentQuestion}
          />
        );
        
      // Add more question types here
        
      default:
        return (
          <div className="py-4 text-gray-500 italic">
            This question type is not yet implemented.
          </div>
        );
    }
  };

  if (submitted) {
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
                  if (question.type === QuestionType.Section) return null;
                  
                  let responseDisplay = "Not answered";
                  const response = responses[question.id];
                  
                  if (response !== undefined) {
                    if (question.type === QuestionType.Choice) {
                      if (Array.isArray(response)) {
                        const options = (question as any).options;
                        responseDisplay = response.map(id => 
                          options.find((opt: any) => opt.id === id)?.text
                        ).join(", ");
                      } else {
                        const options = (question as any).options;
                        const option = options.find((opt: any) => opt.id === response);
                        responseDisplay = option?.text || "Invalid response";
                      }
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
                      <p className="text-gray-700">{responseDisplay}</p>
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
            <h1 className="text-2xl font-bold ml-2">{activeTest.title}</h1>
          </div>
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

// Question Components
function ChoiceQuestionComponent({
  question,
  value,
  onChange,
}: {
  question: any;
  value: any;
  onChange: (value: any) => void;
}) {
  const handleSingleChoice = (optionId: string) => {
    onChange(optionId);
  };

  const handleMultipleChoice = (optionId: string) => {
    if (Array.isArray(value)) {
      if (value.includes(optionId)) {
        onChange(value.filter((id) => id !== optionId));
      } else {
        onChange([...value, optionId]);
      }
    } else {
      onChange([optionId]);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {question.options.map((option: any) => (
        <div key={option.id} className="flex items-center">
          <input
            type={question.allowMultiple ? "checkbox" : "radio"}
            id={option.id}
            name={question.id}
            checked={
              question.allowMultiple
                ? Array.isArray(value) && value.includes(option.id)
                : value === option.id
            }
            onChange={() =>
              question.allowMultiple
                ? handleMultipleChoice(option.id)
                : handleSingleChoice(option.id)
            }
            className="mr-3 h-4 w-4"
          />
          <label htmlFor={option.id} className="text-gray-700">
            {option.text}
          </label>
        </div>
      ))}
    </div>
  );
}

function TextQuestionComponent({
  question,
  value,
  onChange,
}: {
  question: any;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="pt-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder || "Type your answer here..."}
        maxLength={question.maxLength}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {question.maxLength && (
        <div className="text-right text-sm text-gray-500 mt-1">
          {value.length}/{question.maxLength} characters
        </div>
      )}
    </div>
  );
}

function RatingQuestionComponent({
  question,
  value,
  onChange,
}: {
  question: any;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="pt-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-2">
          {question.labels?.start && (
            <span className="text-sm text-gray-500">{question.labels.start}</span>
          )}
          {question.labels?.end && (
            <span className="text-sm text-gray-500">{question.labels.end}</span>
          )}
        </div>
        
        <div className="flex space-x-2 mt-2">
          {Array.from({ length: question.maxRating }).map((_, index) => {
            const rating = index + 1;
            return (
              <button
                key={rating}
                type="button"
                onClick={() => onChange(rating)}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  value >= rating
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {rating}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DateQuestionComponent({
  question,
  value,
  onChange,
}: {
  question: any;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="pt-2">
      <input
        type={question.includeTime ? "datetime-local" : "date"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function SectionComponent({
  question,
}: {
  question: any;
}) {
  return (
    <div className="pt-2">
      {question.description && (
        <p className="text-gray-600">{question.description}</p>
      )}
    </div>
  );
} 