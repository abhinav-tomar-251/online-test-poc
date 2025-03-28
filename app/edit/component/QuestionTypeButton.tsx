export default function QuestionTypeButton({ 
    title, 
    description, 
    icon, 
    onClick 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    onClick: () => void;
  }) {
    return (
      <button
        onClick={onClick}
        className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors text-left flex items-start w-full"
      >
        <span className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <h3 className="font-medium text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{description}</p>
        </div>
      </button>
    );
  }