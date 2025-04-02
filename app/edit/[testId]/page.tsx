"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTestStore, QuestionType } from "@/app/shared/lib/store";
import { Button } from "@/app/shared/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/shared/components/ui/Card";
import { DndContext, DragEndEvent, useSensors, useSensor, PointerSensor, DragOverlay, DragStartEvent, useDroppable } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableQuestionItem from "../component/SortableQuestionItem";
import QuestionTypeButton from "../component/QuestionTypeButton";
import QuestionEditModal from "../component/QuestionEditModal";
import * as React from "react";


// Component for the drag overlay
function QuestionTypeOverlay({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-md opacity-90 w-64">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <h3 className="font-medium">{title}</h3>
      </div>
    </div>
  );
}

// DropArea component to handle drop zone
function DropArea({ children, id }: { children: React.ReactNode, id: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: id
  });

  return (
    <div 
      ref={setNodeRef}
      style={{ 
        touchAction: 'none',
        position: 'relative',
      }}
      className={`bg-gray-50 rounded-lg p-4 sm:p-6 min-h-[300px] sm:min-h-[500px] relative 
        ${isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-dashed border-gray-200'}`}
    >
      {children}
    </div>
  );
}

export default function EditTest({ params }: { params: any }) {
  const unwrappedParams = React.use(params) as { testId: string };
  const testId = unwrappedParams.testId;
  const {activeTest, setActiveTest, updateTest, addQuestion, deleteQuestion, reorderQuestions } = useTestStore();
  const [showQuestionTypeModal, setShowQuestionTypeModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingTestDetails, setEditingTestDetails] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeDragType, setActiveDragType] = useState<QuestionType | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Configure DndKit sensors with higher activation constraint for more reliable dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    setActiveTest(testId); 
    return () => setActiveTest(null);
  }, [testId, setActiveTest]);

  if (!activeTest) {
    return (
      <main className="container mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium mb-4">Test not found</h2>
          <p className="text-gray-500 mb-8">The test you're trying to edit doesn't exist.</p>
          <Link href="/">
            <Button variant="primary">Go to Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateTest(testId, { title: e.target.value });
  };

  const handleUpdateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTest(testId, { description: e.target.value });
  };

  const handleAddQuestion = (type: QuestionType) => {
    const baseQuestion = {
      title: "",
      required: false,
      type,
    };

    let questionData: any = { ...baseQuestion };

    switch (type) {
      case QuestionType.Choice:
        questionData = {
          ...baseQuestion,
          options: [{ id: crypto.randomUUID(), text: "Option 1" }],
          allowMultiple: false,
        };
        break;
      case QuestionType.Text:
        questionData = {
          ...baseQuestion,
          placeholder: "Type your answer here...",
        };
        break;
      case QuestionType.Rating:
        questionData = {
          ...baseQuestion,
          maxRating: 5,
          labels: { start: "Poor", end: "Excellent" },
        };
        break;
      case QuestionType.Date:
        questionData = {
          ...baseQuestion,
          includeTime: false,
        };
        break;
      case QuestionType.Ranking:
        questionData = {
          ...baseQuestion,
          options: [
            { id: crypto.randomUUID(), text: "Option 1" },
            { id: crypto.randomUUID(), text: "Option 2" },
          ],
        };
        break;
      case QuestionType.Likert:
        questionData = {
          ...baseQuestion,
          statements: [{ id: crypto.randomUUID(), text: "Statement 1" }],
          scale: [
            { id: crypto.randomUUID(), text: "Strongly Disagree" },
            { id: crypto.randomUUID(), text: "Disagree" },
            { id: crypto.randomUUID(), text: "Neutral" },
            { id: crypto.randomUUID(), text: "Agree" },
            { id: crypto.randomUUID(), text: "Strongly Agree" },
          ],
        };
        break;
      case QuestionType.UploadFile:
        questionData = {
          ...baseQuestion,
          allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png"],
          maxFileSize: 5, // 5MB
        };
        break;
      case QuestionType.NetPromoterScore:
        questionData = {
          ...baseQuestion,
          labels: { start: "Not likely", end: "Very likely" },
        };
        break;
      case QuestionType.Section:
        questionData = {
          ...baseQuestion,
          title: "New Section",
          description: "Section description",
        };
        break;
    }

    addQuestion(testId, questionData);
    setShowQuestionTypeModal(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(testId, questionId);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    console.log('DragStart - Active ID:', active.id);
    
    // Extract the question type from the ID
    if (typeof active.id === 'string' && active.id.startsWith('question-type-')) {
      const typeString = active.id.replace('question-type-', '');
      console.log('Extracted type string:', typeString);
      
      // Set active drag type directly
      setActiveDragType(typeString as QuestionType);
    }
  };

  const handleDragOver = (event: any) => {
    const { over } = event;
    console.log('DragOver - Over ID:', over?.id);
    
    // Check if we're over the drop area
    const isOverDropArea = over?.id === 'questions-drop-area';
    console.log('Is over drop area:', isOverDropArea);
    
    setIsDraggingOver(isOverDropArea);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('DragEnd - Active ID:', active.id);
    console.log('DragEnd - Over ID:', over?.id);
    
    try {
      // Check if dropped on questions container
      if (over && over.id === 'questions-drop-area' && typeof active.id === 'string' && active.id.startsWith('question-type-')) {
        const typeString = active.id.replace('question-type-', '');
        console.log('Adding question of type:', typeString);
        
        // Add the question directly based on the drag ID
        handleAddQuestion(typeString as QuestionType);
      }
      // Check for reordering questions
      else if (over && active.id !== over.id && typeof active.id === 'string' && !active.id.startsWith('question-type-')) {
        const oldIndex = activeTest.questions.findIndex(q => q.id === active.id);
        const newIndex = activeTest.questions.findIndex(q => q.id === over.id);
        
        if (oldIndex !== -1 && newIndex !== -1) {
          console.log(`Reordering from ${oldIndex} to ${newIndex}`);
          const newQuestions = arrayMove(activeTest.questions, oldIndex, newIndex);
          reorderQuestions(testId, newQuestions.map(q => q.id));
        }
      }
    } catch (error) {
      console.log('Error in drag end:', error);
    }
    
    setActiveId(null);
    setActiveDragType(null);
    setIsDraggingOver(false);
  };

  // Get an icon for a question type
  const getQuestionTypeIcon = (type: QuestionType): string => {
    switch (type) {
      case QuestionType.Choice: return "◉";
      case QuestionType.Text: return "✏️";
      case QuestionType.Rating: return "★";
      case QuestionType.Date: return "📅";
      case QuestionType.Ranking: return "↕️";
      case QuestionType.Likert: return "⚖️";
      case QuestionType.UploadFile: return "📎";
      case QuestionType.NetPromoterScore: return "📊";
      case QuestionType.Section: return "📑";
      default: return "❓";
    }
  };

  // Get title for a question type
  const getQuestionTypeTitle = (type: QuestionType): string => {
    switch (type) {
      case QuestionType.Choice: return "Choice";
      case QuestionType.Text: return "Text";
      case QuestionType.Rating: return "Rating";
      case QuestionType.Date: return "Date";
      case QuestionType.Ranking: return "Ranking";
      case QuestionType.Likert: return "Likert";
      case QuestionType.UploadFile: return "Upload File";
      case QuestionType.NetPromoterScore: return "Net Promoter Score";
      case QuestionType.Section: return "Section";
      default: return "Unknown";
    }
  };

  return (
    <main className="container mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold ml-4 sm:ml-8">Edit Test</h1>
          </div>
          <Link href={`/preview/${testId}`}>
            <Button variant="outline" className="w-full sm:w-auto">Preview Test</Button>
          </Link>
        </div>

        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col lg:flex-row gap-6 justify-between h-full">
            {/* Question Type Selection */}
            <aside className="w-full lg:w-1/3 order-2 lg:order-1">
              <div className="mb-6 lg:mb-0 lg:sticky lg:top-4"> 
                {/* Button For Mobile View */}
                <div className="lg:hidden">
                  <Button 
                    variant="primary" 
                    className="w-full sm:w-auto mb-6"
                    onClick={() => setShowQuestionTypeModal(true)}
                  >
                    Add Question
                  </Button>
                </div>
                
                {/* Desktop Sidebar */}
                <div className="hidden lg:block">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">Add Question</h3>
                    <div className="text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M14 17H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
                          <path d="M14 22l5-5-5-5" />
                        </svg>
                        Click or drag
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <QuestionTypeButton 
                      title="Choice"
                      description="Single or multiple choice questions"
                      icon="◉"
                      onClick={() => handleAddQuestion(QuestionType.Choice)}
                      dragId={`question-type-${QuestionType.Choice}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Text"
                      description="Free-form text responses"
                      icon="✏️"
                      onClick={() => handleAddQuestion(QuestionType.Text)}
                      dragId={`question-type-${QuestionType.Text}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Rating"
                      description="Scale-based ratings"
                      icon="★"
                      onClick={() => handleAddQuestion(QuestionType.Rating)}
                      dragId={`question-type-${QuestionType.Rating}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Date"
                      description="Date and time selection"
                      icon="📅"
                      onClick={() => handleAddQuestion(QuestionType.Date)}
                      dragId={`question-type-${QuestionType.Date}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Ranking"
                      description="Ordering items by preference"
                      icon="↕️"
                      onClick={() => handleAddQuestion(QuestionType.Ranking)}
                      dragId={`question-type-${QuestionType.Ranking}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Likert"
                      description="Agreement scale questions"
                      icon="⚖️"
                      onClick={() => handleAddQuestion(QuestionType.Likert)}
                      dragId={`question-type-${QuestionType.Likert}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Upload File"
                      description="File upload responses"
                      icon="📎"
                      onClick={() => handleAddQuestion(QuestionType.UploadFile)}
                      dragId={`question-type-${QuestionType.UploadFile}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Net Promoter Score"
                      description="Measure customer loyalty"
                      icon="📊"
                      onClick={() => handleAddQuestion(QuestionType.NetPromoterScore)}
                      dragId={`question-type-${QuestionType.NetPromoterScore}`}
                      isDraggable={true}
                    />
                    <QuestionTypeButton 
                      title="Section"
                      description="Organize questions into groups"
                      icon="📑"
                      onClick={() => handleAddQuestion(QuestionType.Section)}
                      dragId={`question-type-${QuestionType.Section}`}
                      isDraggable={true}
                    />
                  </div>
                </div>
                
                {/* Mobile Modal */}
                {showQuestionTypeModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 lg:hidden">
                    <div className="bg-white rounded-lg max-w-3xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg sm:text-xl font-semibold">Select Question Type</h3>
                        <button 
                          onClick={() => setShowQuestionTypeModal(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <QuestionTypeButton 
                          title="Choice"
                          description="Single or multiple choice questions"
                          icon="◉"
                          onClick={() => handleAddQuestion(QuestionType.Choice)}
                        />
                        <QuestionTypeButton 
                          title="Text"
                          description="Free-form text responses"
                          icon="✏️"
                          onClick={() => handleAddQuestion(QuestionType.Text)}
                        />
                        <QuestionTypeButton 
                          title="Rating"
                          description="Scale-based ratings"
                          icon="★"
                          onClick={() => handleAddQuestion(QuestionType.Rating)}
                        />
                        <QuestionTypeButton 
                          title="Date"
                          description="Date and time selection"
                          icon="📅"
                          onClick={() => handleAddQuestion(QuestionType.Date)}
                        />
                        <QuestionTypeButton 
                          title="Ranking"
                          description="Ordering items by preference"
                          icon="↕️"
                          onClick={() => handleAddQuestion(QuestionType.Ranking)}
                        />
                        <QuestionTypeButton 
                          title="Likert"
                          description="Agreement scale questions"
                          icon="⚖️"
                          onClick={() => handleAddQuestion(QuestionType.Likert)}
                        />
                        <QuestionTypeButton 
                          title="Upload File"
                          description="File upload responses"
                          icon="📎"
                          onClick={() => handleAddQuestion(QuestionType.UploadFile)}
                        />
                        <QuestionTypeButton 
                          title="Net Promoter Score"
                          description="Measure customer loyalty"
                          icon="📊"
                          onClick={() => handleAddQuestion(QuestionType.NetPromoterScore)}
                        />
                        <QuestionTypeButton 
                          title="Section"
                          description="Organize questions into groups"
                          icon="📑"
                          onClick={() => handleAddQuestion(QuestionType.Section)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
            
            <div className="flex-1 order-1 lg:order-2">
              {/* Simplified Test Details Card */}
              <div className="mb-6 sm:mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{activeTest.title || "Untitled Test"}</CardTitle>
                      {activeTest.description && (
                        <p className="text-sm text-gray-500 mt-1">{activeTest.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingTestDetails(true)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m15 5 4 4" />
                      </svg>
                    </button>
                  </CardHeader>
                </Card>
              </div>

              {/* Questions View Section */}
              <DropArea id="questions-drop-area">
                {activeTest.questions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 bg-transparent rounded-lg">
                    <h3 className="text-lg sm:text-xl font-medium text-gray-500">No questions yet</h3>
                    <p className="text-gray-400 mt-2 mb-4">Add your first question to get started</p>
                    <Button 
                      variant="primary" 
                      onClick={() => setShowQuestionTypeModal(true)}
                      className="w-full sm:w-auto lg:hidden"
                    >
                      Add Question
                    </Button>
                    <div className="hidden lg:block">
                      <p className="text-sm text-gray-500 mb-2">Click a question type or drag it into this area</p>
                      <div className="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <path d="M14 17H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
                          <path d="M14 22l5-5-5-5" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SortableContext 
                    items={activeTest.questions.map(q => q.id)} 
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {activeTest.questions.map((question) => (
                        <SortableQuestionItem
                          key={question.id}
                          question={question}
                          onEdit={() => setEditingQuestion(question.id)}
                          onDelete={() => handleDeleteQuestion(question.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                )}

                {/* Drop zone indicator when dragging question type */}
                {activeDragType !== null && (
                  <div className="absolute inset-0 border-4 border-dashed border-blue-500 bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                    <div className="bg-white p-5 rounded-md shadow-lg">
                      <h3 className="text-lg font-bold text-blue-600 flex items-center">
                        <span className="text-2xl mr-2">{getQuestionTypeIcon(activeDragType)}</span>
                        Drop to add {getQuestionTypeTitle(activeDragType)}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Release to add this question type
                      </p>
                    </div>
                  </div>
                )}
              </DropArea>
            </div>
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeId && activeDragType !== null && (
              <QuestionTypeOverlay 
                title={getQuestionTypeTitle(activeDragType)} 
                icon={getQuestionTypeIcon(activeDragType)} 
              />
            )}
          </DragOverlay>
        </DndContext>
      
      {/* Test Details Edit Modal */}
      {editingTestDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">  
          {/* Test Details Card */}
          <Card className="max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <CardTitle>Test Details</CardTitle>
                <button 
                  onClick={() => setEditingTestDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                  Test Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={activeTest.title}
                  onChange={handleUpdateTitle}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={activeTest.description || ""}
                  onChange={handleUpdateDescription}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="primary" onClick={() => setEditingTestDetails(false)} className="w-full sm:w-auto">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </div> 
      )}
      
      {/* Question Edit Modal */}
      {editingQuestion && (
        <QuestionEditModal
          questionId={editingQuestion}
          testId={testId}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </main>
  );
}
