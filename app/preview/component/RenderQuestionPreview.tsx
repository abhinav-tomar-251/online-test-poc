import { QuestionType } from "@/app/shared/lib/store";

export default function renderQuestionPreview(question: any) {
    switch (question.type) {
      case QuestionType.Choice:
        return (
          <div className="space-y-3">
            {question.options.map((option: any) => (
              <div key={option.id} className="flex items-center">
                <input
                  type={question.allowMultiple ? "checkbox" : "radio"}
                  id={`preview-${option.id}`}
                  name={`preview-${question.id}`}
                  disabled
                  className="mr-3 h-4 w-4"
                />
                <label htmlFor={`preview-${option.id}`} className="text-gray-700">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );
  
      case QuestionType.Text:
        return (
          <textarea
            disabled
            placeholder={question.placeholder || "Type your answer here..."}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
          />
        );
  
      case QuestionType.Rating:
        return (
          <div className="mt-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                {question.labels?.start && (
                  <span className="text-sm text-gray-500">{question.labels.start}</span>
                )}
                {question.labels?.end && (
                  <span className="text-sm text-gray-500">{question.labels.end}</span>
                )}
              </div>
              
              <div className="flex space-x-2 mt-2">
                {Array.from({ length: question.maxRating }).map((_, index) => {
                  const rating = index + 1;
                  return (
                    <button
                      key={rating}
                      disabled
                      type="button"
                      className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors bg-gray-100 text-gray-700"
                    >
                      {rating}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
  
      case QuestionType.Date:
        return (
          <input
            type={question.includeTime ? "datetime-local" : "date"}
            disabled
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
          />
        );
  
      case QuestionType.Ranking:
        return (
          <div className="space-y-2">
            {question.options.map((option: any, index: number) => (
              <div key={option.id} className="flex items-center bg-gray-50 p-3 rounded border border-gray-200">
                <span className="mr-3 text-gray-500 font-medium">{index + 1}</span>
                <span>{option.text}</span>
              </div>
            ))}
          </div>
        );
  
      case QuestionType.Likert:
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left"></th>
                  {question.scale.map((item: any) => (
                    <th key={item.id} className="py-2 px-4 text-center text-sm">
                      {item.text}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {question.statements.map((statement: any) => (
                  <tr key={statement.id} className="border-t">
                    <td className="py-2 px-4 text-left">{statement.text}</td>
                    {question.scale.map((item: any) => (
                      <td key={item.id} className="py-2 px-4 text-center">
                        <input
                          type="radio"
                          disabled
                          name={`preview-${question.id}-${statement.id}`}
                          className="h-4 w-4"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
  
      case QuestionType.UploadFile:
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-sm mt-1">
              Allowed: {question.allowedFileTypes?.join(", ") || "All files"} 
              {question.maxFileSize && ` (Max: ${question.maxFileSize}MB)`}
            </p>
          </div>
        );
  
      case QuestionType.NetPromoterScore:
        return (
          <div className="mt-2">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-2">
                {question.labels?.start && (
                  <span className="text-sm text-gray-500">{question.labels.start}</span>
                )}
                {question.labels?.end && (
                  <span className="text-sm text-gray-500">{question.labels.end}</span>
                )}
              </div>
              
              <div className="flex space-x-1 mt-2">
                {Array.from({ length: 11 }).map((_, index) => (
                  <button
                    key={index}
                    disabled
                    type="button"
                    className="h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors bg-gray-100 text-gray-700"
                  >
                    {index}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
  
      case QuestionType.Section:
        return null;
  
      default:
        return (
          <div className="py-4 text-gray-500 italic">
            Preview not available for this question type.
          </div>
        );
    }
  } 