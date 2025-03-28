import { Button } from "@/app/shared/components/ui/Button";
import { QuestionType, useTestStore } from "@/app/shared/lib/store";

export default function QuestionEditModal({ 
    questionId, 
    testId, 
    onClose 
  }: { 
    questionId: string; 
    testId: string; 
    onClose: () => void;
  }) {
    const { activeTest, updateQuestion } = useTestStore();
    const question = activeTest?.questions.find(q => q.id === questionId);
    
    if (!question) return null;
    
    const handleToggleRequired = () => {
      updateQuestion(testId, questionId, { required: !question.required });
    };
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateQuestion(testId, questionId, { title: e.target.value });
    };
    
    const handleUpdateChoiceOption = (optionId: string, updates: { text?: string; correct?: boolean }) => {
      if (question.type !== QuestionType.Choice) return;
      updateQuestion(testId, questionId, {
        options: question.options.map(opt => 
          opt.id === optionId ? { ...opt, ...updates } : opt
        )
      });
    };
    
    const handleToggleCorrect = (optionId: string) => {
      if (question.type !== QuestionType.Choice) return;
      
      // Find the option
      const option = question.options.find(opt => opt.id === optionId);
      if (!option) return;
      
      // For single choice, unmark all other options as correct
      if (!question.allowMultiple) {
        updateQuestion(testId, questionId, {
          options: question.options.map(opt => ({
            ...opt,
            correct: opt.id === optionId
          }))
        });
      } else {
        // For multiple choice, just toggle this option
        handleUpdateChoiceOption(optionId, { correct: !option.correct });
      }
    };
    
    const handleAddChoiceOption = () => {
      if (question.type !== QuestionType.Choice) return;
      updateQuestion(testId, questionId, {
        options: [...question.options, { id: crypto.randomUUID(), text: "New Option" }]
      });
    };
    
    const handleRemoveChoiceOption = (optionId: string) => {
      if (question.type !== QuestionType.Choice) return;
      updateQuestion(testId, questionId, {
        options: question.options.filter(opt => opt.id !== optionId)
      });
    };
    
    const handleToggleMultiple = () => {
      if (question.type !== QuestionType.Choice) return;
      updateQuestion(testId, questionId, {
        allowMultiple: !question.allowMultiple
      });
    };
    
    const handleAddRankingOption = () => {
      if (question.type !== QuestionType.Ranking) return;
      updateQuestion(testId, questionId, {
        options: [...question.options, { id: crypto.randomUUID(), text: "New Option" }]
      });
    };
    
    const handleRemoveRankingOption = (optionId: string) => {
      if (question.type !== QuestionType.Ranking) return;
      updateQuestion(testId, questionId, {
        options: question.options.filter(opt => opt.id !== optionId)
      });
    };
    
    const handleAddLikertStatement = () => {
      if (question.type !== QuestionType.Likert) return;
      updateQuestion(testId, questionId, {
        statements: [...question.statements, { id: crypto.randomUUID(), text: "New Statement" }]
      });
    };
    
    const handleRemoveLikertStatement = (statementId: string) => {
      if (question.type !== QuestionType.Likert) return;
      updateQuestion(testId, questionId, {
        statements: question.statements.filter(stmt => stmt.id !== statementId)
      });
    };
    
    const renderQuestionFields = () => {
      switch (question.type) {
        case QuestionType.Choice:
          return (
            <div className="space-y-4 mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  checked={question.allowMultiple}
                  onChange={handleToggleMultiple}
                  className="mr-2"
                />
                <label htmlFor="allowMultiple">Allow multiple selections</label>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Options</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {question.allowMultiple 
                    ? "Check the boxes next to correct answers (multiple can be selected)" 
                    : "Check the box next to the correct answer"}
                </p>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <div className="mr-2">
                        <input
                          type="checkbox"
                          id={`correct-${option.id}`}
                          checked={option.correct || false}
                          onChange={() => handleToggleCorrect(option.id)}
                          className="h-4 w-4 border-gray-300 rounded text-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleUpdateChoiceOption(option.id, { text: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow"
                      />
                      <button 
                        onClick={() => handleRemoveChoiceOption(option.id)}
                        className="ml-2 p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded"
                        disabled={question.options.length <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddChoiceOption}
                  className="mt-3 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                  </svg>
                  Add Option
                </button>
              </div>
            </div>
          );
        
        case QuestionType.Text:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="placeholder">
                  Placeholder Text
                </label>
                <input
                  id="placeholder"
                  type="text"
                  value={question.placeholder || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxLength">
                  Maximum Length (characters)
                </label>
                <input
                  id="maxLength"
                  type="number"
                  value={question.maxLength || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>
            </div>
          );
        
        // You can add more case handlers for other question types
             
        case QuestionType.Rating:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="minValue">
                  Minimum Value
                </label>
                <input
                  id="minValue"
                  type="number"
                  value={question.minValue || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { minValue: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxValue">
                  Maximum Value
                </label>
                <input
                  id="maxValue"
                  type="number"
                  value={question.maxValue || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { maxValue: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxRating">
                  Max Rating
                </label>
                <input
                  id="maxRating"
                  type="number"
                  value={question.maxRating || 5}
                  onChange={(e) => updateQuestion(testId, questionId, { maxRating: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labels
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startLabel">
                      Start Label
                    </label>
                    <input
                      id="startLabel"
                      type="text"
                      value={question.labels?.start || ""}
                      onChange={(e) => updateQuestion(testId, questionId, { 
                        labels: { ...question.labels, start: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Not at all likely"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endLabel">
                      End Label
                    </label>
                    <input
                      id="endLabel"
                      type="text"
                      value={question.labels?.end || ""}
                      onChange={(e) => updateQuestion(testId, questionId, { 
                        labels: { ...question.labels, end: e.target.value } 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Extremely likely"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
          
        case QuestionType.Date:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="includeTime">
                  Include Time
                </label>
                <input
                  id="includeTime"
                  type="checkbox"
                  checked={question.includeTime}
                  onChange={() => updateQuestion(testId, questionId, { includeTime: !question.includeTime })}
                />
              </div>
            </div>
          );
          
        case QuestionType.Ranking:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="options">
                  Options
                </label>
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => updateQuestion(testId, questionId, {
                          options: question.options.map(opt => 
                            opt.id === option.id ? { ...opt, text: e.target.value } : opt
                          )
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow"
                      />
                      <button 
                        onClick={() => handleRemoveRankingOption(option.id)}
                        className="ml-2 p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded"
                        disabled={question.options.length <= 1}
                      > 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddRankingOption}
                  className="mt-3 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"></svg>
                  Add Option
                </button>
              </div>
            </div>
          );
          
        case QuestionType.Likert:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="statements">
                  Statements
                </label>
                <div className="space-y-2">
                  {question.statements.map((statement) => (
                    <div key={statement.id} className="flex items-center">
                      <input
                        type="text"
                        value={statement.text}
                        onChange={(e) => updateQuestion(testId, questionId, {
                          statements: question.statements.map(stmt => 
                            stmt.id === statement.id ? { ...stmt, text: e.target.value } : stmt
                          )
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow"
                      />
                      <button 
                        onClick={() => handleRemoveLikertStatement(statement.id)}
                        className="ml-2 p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded"
                        disabled={question.statements.length <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={handleAddLikertStatement}
                  className="mt-3 text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"></svg>
                  Add Statement
                </button>
              </div>
            </div>
          );
          
        case QuestionType.UploadFile:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="allowedTypes">
                  Allowed File Types
                </label>
                <input
                  id="allowedTypes"
                  type="text"
                  value={question.allowedFileTypes?.join(", ") || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { allowedFileTypes: e.target.value.split(",").map(type => type.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="maxFileSize">
                  Maximum File Size (MB)
                </label>
                <input
                  id="maxFileSize"
                  type="number"
                  value={question.maxFileSize || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { maxFileSize: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
              </div>
            </div>
          );
          
        case QuestionType.NetPromoterScore:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="labels">
                  Labels
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="startLabel">
                      Start Label
                    </label>
                    <input
                      id="startLabel"
                      type="text"
                      value={question.labels?.start || ""}
                      onChange={(e) => updateQuestion(testId, questionId, { labels: { ...question.labels, start: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="endLabel">
                      End Label
                    </label>
                    <input
                      id="endLabel"
                      type="text"
                      value={question.labels?.end || ""}
                      onChange={(e) => updateQuestion(testId, questionId, { labels: { ...question.labels, end: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          );

        case QuestionType.Section:
          return (
            <div className="space-y-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description
                </label>
                <input
                  id="description"
                  type="text"
                  value={question.description || ""}
                  onChange={(e) => updateQuestion(testId, questionId, { description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          );
        
        default:
          return (
            <p className="mt-4 italic text-gray-500">
              Advanced options for this question type will be added soon.
            </p>
          );
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-semibold">Edit Question</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="questionTitle">
                Question Text
              </label>
              <input
                id="questionTitle"
                type="text"
                value={question.title}
                onChange={handleTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter question text"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={question.required}
                onChange={handleToggleRequired}
                className="mr-2"
              />
              <label htmlFor="required">Required question</label>
            </div>
            
            {/*score field for all question types except Section and Net Promoter Score*/}
            {question.type !== QuestionType.Section && question.type !== QuestionType.NetPromoterScore && (
              <div className="mt-3 sm:mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="questionScore">
                  Score
                </label>
                <input
                  id="questionScore"
                  type="number"
                  value={question.score || 0}
                  onChange={(e) => updateQuestion(testId, questionId, { score: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Maximum points for this question"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for unscored questions
                </p>
              </div>
            )}
            
            {renderQuestionFields()}
            
            <div className="pt-3 sm:pt-4 flex justify-end">
              <Button variant="primary" onClick={onClose} className="w-full sm:w-auto">
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } 