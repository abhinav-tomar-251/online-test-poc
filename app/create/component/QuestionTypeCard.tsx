export default function QuestionTypeCard({ title, description, icon }: { title: string; description: string; icon: string }) {
    return (
      <div className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center mb-1 sm:mb-2">
          <span className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">{icon}</span>
          <h3 className="font-medium text-sm sm:text-base">{title}</h3>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    );
} 