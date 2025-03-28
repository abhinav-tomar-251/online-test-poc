import { Button } from "@/app/components/ui/Button";
import { QuestionType, useTestStore } from "@/lib/store";

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
    
    const handleUpdateChoiceOption = (optionId: string, text: string) => {
      if (question.type !== QuestionType.Choice) return;
      updateQuestion(testId, questionId, {
        options: question.options.map(opt => 
          opt.id === optionId ? { ...opt, text } : opt
        )
      });
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
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => handleUpdateChoiceOption(option.id, e.target.value)}
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
             
        default:
          return (
            <p className="mt-4 italic text-gray-500">
              Advanced options for this question type will be added soon.
            </p>
          );
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Edit Question</h3>
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
          
          <div className="space-y-6">
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
            
            {renderQuestionFields()}
            
            <div className="pt-4 flex justify-end">
              <Button variant="primary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } 