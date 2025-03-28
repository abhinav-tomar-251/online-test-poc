'use client'
import { useEffect, useState } from "react";

export function ChoiceQuestionComponent({
    question,
    value,
    onChange,
}: {
    question: any;
    value: any;
    onChange: (value: any) => void;
}) {
    const handleSingleChoice = (optionId: string) => {
      onChange(optionId);
    };
  
    const handleMultipleChoice = (optionId: string) => {
      if (Array.isArray(value)) {
        if (value.includes(optionId)) {
          onChange(value.filter((id) => id !== optionId));
        } else {
          onChange([...value, optionId]);
        }
      } else {
        onChange([optionId]);
      }
    };
  
    return (
      <div className="space-y-3 pt-2">
        {question.options.map((option: any) => (
          <div key={option.id} className="flex items-center">
            <input
              type={question.allowMultiple ? "checkbox" : "radio"}
              id={option.id}
              name={question.id}
              checked={
                question.allowMultiple
                  ? Array.isArray(value) && value.includes(option.id)
                  : value === option.id
              }
              onChange={() =>
                question.allowMultiple
                  ? handleMultipleChoice(option.id)
                  : handleSingleChoice(option.id)
              }
              className="mr-3 h-4 w-4"
            />
            <label htmlFor={option.id} className="text-gray-700">
              {option.text}
            </label>
          </div>
        ))}
      </div>
    );
}

export function TextQuestionComponent({
    question,
    value,
    onChange,
}: {
    question: any;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="pt-2">
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder || "Type your answer here..."}
            maxLength={question.maxLength}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {question.maxLength && (
            <div className="text-right text-sm text-gray-500 mt-1">
            {value.length}/{question.maxLength} characters
            </div>
        )}
        </div>
    );
}
  
export function RatingQuestionComponent({
question,
value,
onChange,
}: {
question: any;
value: number;
onChange: (value: number) => void;
}) {
return (
    <div className="pt-4">
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
                type="button"
                onClick={() => onChange(rating)}
                className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                value >= rating
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
                {rating}
            </button>
            );
        })}
        </div>
    </div>
    </div>
);
}
  
export function DateQuestionComponent({
question,
value,
onChange,
}: {
question: any;
value: string;
onChange: (value: string) => void;
}) {
return (
    <div className="pt-2">
    <input
        type={question.includeTime ? "datetime-local" : "date"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
    </div>
);
}
  
export function SectionComponent({
question,
}: {
question: any;
}) {
return (
    <div className="pt-2">
    {question.description && (
        <p className="text-gray-600">{question.description}</p>
    )}
    </div>
);
}
  
export function RankingQuestionComponent({
question,
value,
onChange,
}: {
question: any;
value: string[];
onChange: (value: string[]) => void;
}) {
const [draggedItem, setDraggedItem] = useState<number | null>(null);

useEffect(() => {
    if (!value || value.length === 0) {
    onChange([...question.options.map((o: any) => o.id)]);
    }
}, []);

const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...value];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    onChange(newOrder);
};

const handleDragStart = (index: number) => {
    setDraggedItem(index);
};

const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    const draggedOverItem = document.querySelector(`[data-index="${index}"]`);
    if (draggedOverItem) {
    draggedOverItem.classList.add('bg-blue-50', 'border-blue-300');
    }
};

const handleDragLeave = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    
    const draggedOverItem = document.querySelector(`[data-index="${index}"]`);
    if (draggedOverItem) {
    draggedOverItem.classList.remove('bg-blue-50', 'border-blue-300');
    }
};

const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    const draggedOverItem = document.querySelector(`[data-index="${dropIndex}"]`);
    if (draggedOverItem) {
    draggedOverItem.classList.remove('bg-blue-50', 'border-blue-300');
    }
    
    if (draggedItem !== null && draggedItem !== dropIndex) {
    moveItem(draggedItem, dropIndex);
    setDraggedItem(null);
    }
};

const handleDragEnd = () => {
    setDraggedItem(null);
    // Remove any lingering highlight classes
    document.querySelectorAll('.bg-blue-50, .border-blue-300').forEach(el => {
    el.classList.remove('bg-blue-50', 'border-blue-300');
    });
};

return (
    <div className="space-y-2 pt-4">
    <p className="text-sm text-gray-500 mb-2">Drag to reorder options or use the arrow buttons</p>
    {value.map((optionId, index) => {
        const option = question.options.find((o: any) => o.id === optionId);
        return (
        <div 
            key={optionId} 
            data-index={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className="flex items-center bg-white p-3 rounded border border-gray-200 shadow-sm transition-colors cursor-grab"
        >
            <span className="mr-3 w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-gray-500 font-medium">
                {index + 1}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-400">
                <circle cx="8" cy="8" r="1"/>
                <circle cx="8" cy="16" r="1"/>
                <circle cx="16" cy="8" r="1"/>
                <circle cx="16" cy="16" r="1"/>
            </svg>
            <span className="flex-grow">{option?.text}</span>
            <div className="flex">
                <button
                type="button"
                onClick={() => index > 0 && moveItem(index, index - 1)}
                disabled={index === 0}
                className={`p-1 mr-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m18 15-6-6-6 6"/>
                </svg>
                </button>
                <button
                type="button"
                onClick={() => index < value.length - 1 && moveItem(index, index + 1)}
                disabled={index === value.length - 1}
                className={`p-1 rounded ${index === value.length - 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
                </button>
            </div>
        </div>
        );
    })}
    </div>
);
}
  
export function LikertQuestionComponent({
question,
value,
onChange,
}: {
question: any;
value: Record<string, string>;
onChange: (value: Record<string, string>) => void;
}) {
const handleSelection = (statementId: string, scaleId: string) => {
    onChange({
    ...value,
    [statementId]: scaleId
    });
};

return (
    <div className="pt-4 overflow-x-auto">
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
            {question.scale.map((scale: any) => (
                <td key={scale.id} className="py-2 px-4 text-center">
                <input
                    type="radio"
                    id={`${statement.id}-${scale.id}`}
                    name={`likert-${statement.id}`}
                    checked={value[statement.id] === scale.id}
                    onChange={() => handleSelection(statement.id, scale.id)}
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
}
  
export function UploadFileQuestionComponent({
question,
value,
onChange,
}: {
question: any;
value: File | null;
onChange: (value: File | null) => void;
}) {
const [dragActive, setDragActive] = useState(false);

const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
    setDragActive(true);
    } else if (e.type === "dragleave") {
    setDragActive(false);
    }
};

const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
    }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    validateAndSetFile(file);
    }
};

const validateAndSetFile = (file: File) => {
    let validFile = true;
    
    // Check file type if restrictions exist
    if (question.allowedFileTypes && question.allowedFileTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!question.allowedFileTypes.some((type: string) => type.toLowerCase().includes(fileExtension || ''))) {
        alert(`File type not allowed. Allowed types: ${question.allowedFileTypes.join(', ')}`);
        validFile = false;
    }
    }
    
    // Check file size if restriction exists
    if (question.maxFileSize && file.size > question.maxFileSize * 1024 * 1024) {
    alert(`File is too large. Maximum size: ${question.maxFileSize}MB`);
    validFile = false;
    }
    
    if (validFile) {
    onChange(file);
    }
};

const handleRemoveFile = () => {
    onChange(null);
};

return (
    <div className="pt-4">
    {!value ? (
        <div
        className={`border-2 ${dragActive ? 'border-blue-500' : 'border-dashed border-gray-300'} rounded-lg p-6 text-center`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-gray-500">Click to upload or drag and drop</p>
        <p className="text-gray-400 text-sm mt-1">
            Allowed: {question.allowedFileTypes?.join(", ") || "All files"} 
            {question.maxFileSize && ` (Max: ${question.maxFileSize}MB)`}
        </p>
        <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={question.allowedFileTypes?.join(",")}
            id={`file-${question.id}`}
        />
        <label htmlFor={`file-${question.id}`} className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Browse Files
        </label>
        </div>
    ) : (
        <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
                <p className="font-medium">{value.name}</p>
                <p className="text-sm text-gray-500">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            </div>
            <button 
            type="button" 
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700 p-2"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            </button>
        </div>
        </div>
    )}
    </div>
);
}
  
export function NetPromoterScoreComponent({
question,
value,
onChange,
}: {
question: any;
value: number;
onChange: (value: number) => void;
}) {
return (
    <div className="pt-4">
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
            type="button"
            onClick={() => onChange(index)}
            className={`h-10 w-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                value === index
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            >
            {index}
            </button>
        ))}
        </div>
    </div>
    </div>
);
}