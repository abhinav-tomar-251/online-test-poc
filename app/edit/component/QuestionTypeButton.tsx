import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function QuestionTypeButton({ 
    title, 
    description, 
    icon, 
    onClick,
    dragId,
    isDraggable = false
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    onClick: () => void;
    dragId?: string;
    isDraggable?: boolean;
  }) {
    const { attributes, listeners, setNodeRef, transform } = useSortable({
      id: dragId || 'button',
      disabled: !isDraggable,
    });
    
    const style = transform ? {
      transform: CSS.Transform.toString(transform),
    } : undefined;
    
    return (
      <button
        ref={isDraggable ? setNodeRef : undefined}
        style={isDraggable ? style : undefined}
        onClick={onClick}
        className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors text-left flex items-start w-full relative"
      >
        {isDraggable && (
          <div 
            {...attributes} 
            {...listeners}
            className="absolute top-2 right-2 p-1.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            onClick={(e) => e.stopPropagation()} 
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 9l4-4 4 4" />
              <path d="M5 15l4 4 4-4" />
            </svg>
          </div>
        )}
        <span className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <h3 className="font-medium text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
        </div>
      </button>
    );
  }