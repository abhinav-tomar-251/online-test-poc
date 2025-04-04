"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTestStore } from "@/app/shared/lib/store";
import { Button } from "../shared/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../shared/components/ui/Card";
import QuestionTypeCard from "./component/QuestionTypeCard";

export default function CreateTest() {
  const router = useRouter();
  const { createTest } = useTestStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Test title is required");
      return;
    }
    
    const newTest = createTest(title, description);
    router.push(`/edit/${newTest.id}`);
  };
  
  return (
    <>
      <main className="container mx-auto pt-20 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex items-start mb-6 sm:mb-10">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold ml-4 sm:ml-8">Create New Test</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 justify-between h-full">
          {/* Left Sidebar - Question Types */}
          <aside className="w-full lg:w-1/3 order-2 lg:order-1">
            <div className="lg:sticky lg:top-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Question Types Available</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto max-h-[40vh] lg:max-h-[calc(100vh-200px)]">
                <QuestionTypeCard
                  title="Choice"
                  description="Single or multiple choice questions"
                  icon="◉"
                />
                <QuestionTypeCard
                  title="Text"
                  description="Free-form text responses"
                  icon="✏️"
                />
                <QuestionTypeCard
                  title="Rating"
                  description="Scale-based ratings"
                  icon="★"
                />
                <QuestionTypeCard
                  title="Date"
                  description="Date and time selection"
                  icon="📅"
                />
                <QuestionTypeCard
                  title="Ranking"
                  description="Ordering items by preference"
                  icon="↕️"
                />
                <QuestionTypeCard
                  title="Likert"
                  description="Agreement scale questions"
                  icon="⚖️"
                />
                <QuestionTypeCard
                  title="Upload File"
                  description="File upload responses"
                  icon="📎"
                />
                <QuestionTypeCard
                  title="Net Promoter Score"
                  description="Measure customer loyalty"
                  icon="📊"
                />
                <QuestionTypeCard
                  title="Section"
                  description="Organize questions into groups"
                  icon="📑"
                />
              </div>
            </div>
          </aside>

          {/* Right Side - Test Details */}
          <div className="flex-1 order-1 lg:order-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                      Test Title*
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter test title"
                    />
                    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter test description"
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" variant="primary">
                      Create Test & Add Questions
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
