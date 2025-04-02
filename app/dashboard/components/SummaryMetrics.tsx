import { Card, CardContent } from "@/app/shared/components/ui/Card";

interface SummaryMetricsProps {
  analytics: {
    totalTests: number;
    totalCompletions: number;
    averageScore: number;
    completionRate: number;
  }
}

export default function SummaryMetrics({ analytics }: SummaryMetricsProps) {
  const { totalTests, totalCompletions, averageScore, completionRate } = analytics;
  
  const metricCards = [
    {
      title: "Total Tests",
      value: totalTests,
      icon: "📝",
      description: "Tests created"
    },
    {
      title: "Completions",
      value: totalCompletions,
      icon: "✅",
      description: "Total test submissions"
    },
    {
      title: "Avg. Score",
      value: `${averageScore}%`,
      icon: "📊",
      description: "Average score percentage"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: "📈",
      description: "Tests with responses"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {metricCards.map((metric, index) => (
        <Card key={index} className="shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-3">{metric.icon}</span>
              <h3 className="text-lg font-medium text-gray-700">{metric.title}</h3>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold text-gray-800">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 