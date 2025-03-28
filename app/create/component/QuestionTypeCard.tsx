export default function QuestionTypeCard({ title, description, icon }: { title: string; description: string; icon: string }) {
    return (
      <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    );
} 