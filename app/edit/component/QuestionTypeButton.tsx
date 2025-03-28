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
        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors text-left flex items-start"
      >
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </button>
    );
  }