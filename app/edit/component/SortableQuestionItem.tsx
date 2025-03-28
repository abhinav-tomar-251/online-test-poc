import { Question, QuestionType } from "@/lib/store";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableQuestionItem({ 
    question, 
    onEdit, 
    onDelete 
  }: { 
    question: Question; 
    onEdit: () => void; 
    onDelete: () => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    const questionTypeIcons = {
      [QuestionType.Choice]: "◉",
      [QuestionType.Text]: "✏️",
      [QuestionType.Rating]: "★",
      [QuestionType.Date]: "📅",
      [QuestionType.Ranking]: "↕️",
      [QuestionType.Likert]: "⚖️",
      [QuestionType.UploadFile]: "📎",
      [QuestionType.NetPromoterScore]: "📊",
      [QuestionType.Section]: "📑",
    };
    
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="border border-gray-200 rounded-lg bg-white shadow-sm"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                {...attributes} 
                {...listeners}
                className="flex items-center justify-center w-8 h-8 mr-3 cursor-move text-gray-400 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="9" y2="9" />
                  <line x1="4" x2="20" y1="15" y2="15" />
                </svg>
              </div>
              <div className="flex items-center">
                <span className="text-xl mr-3">{questionTypeIcons[question.type]}</span>
                <div>
                  <h3 className="font-medium">{question.title || "Untitled Question"}</h3>
                  <span className="text-xs text-gray-500 capitalize">{question.type}</span>
                  {question.required && <span className="text-xs text-red-500 ml-2">Required</span>}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }