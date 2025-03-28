import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Question types enum
export enum QuestionType {
  Choice = 'choice',
  Text = 'text',
  Rating = 'rating',
  Date = 'date',
  Ranking = 'ranking',
  Likert = 'likert',
  UploadFile = 'uploadFile',
  NetPromoterScore = 'nps',
  Section = 'section',
}

// Question interfaces
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: QuestionType.Choice;
  options: { id: string; text: string }[];
  allowMultiple: boolean;
}

export interface TextQuestion extends BaseQuestion {
  type: QuestionType.Text;
  placeholder?: string;
  maxLength?: number;
}

export interface RatingQuestion extends BaseQuestion {
  type: QuestionType.Rating;
  maxRating: number;
  minValue?: number;
  maxValue?: number;
  labels?: { start?: string; end?: string };
}

export interface DateQuestion extends BaseQuestion {
  type: QuestionType.Date;
  includeTime: boolean;
}

export interface RankingQuestion extends BaseQuestion {
  type: QuestionType.Ranking;
  options: { id: string; text: string }[];
}

export interface LikertQuestion extends BaseQuestion {
  type: QuestionType.Likert;
  statements: { id: string; text: string }[];
  scale: { id: string; text: string }[];
}

export interface UploadFileQuestion extends BaseQuestion {
  type: QuestionType.UploadFile;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
}

export interface NetPromoterScoreQuestion extends BaseQuestion {
  type: QuestionType.NetPromoterScore;
  labels?: { start?: string; end?: string };
}

export interface SectionQuestion extends BaseQuestion {
  type: QuestionType.Section;
  description?: string;
}

export type Question =
  | ChoiceQuestion
  | TextQuestion
  | RatingQuestion
  | DateQuestion
  | RankingQuestion
  | LikertQuestion
  | UploadFileQuestion
  | NetPromoterScoreQuestion
  | SectionQuestion;

// Test interface
export interface Test {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

// Response interfaces
export interface QuestionResponse {
  questionId: string;
  value: any;
}

export interface TestResponse {
  id: string;
  testId: string;
  responses: QuestionResponse[];
  submittedAt: Date;
}

// Store interface
interface TestStore {
  tests: Test[];
  activeTest: Test | null;
  responses: TestResponse[];
  
  // Test actions
  createTest: (title: string, description?: string) => Test;
  updateTest: (testId: string, updates: Partial<Test>) => void;
  deleteTest: (testId: string) => void;
  setActiveTest: (testId: string | null) => void;
  
  // Question actions
  addQuestion: (testId: string, question: Omit<Question, 'id'>) => void;
  updateQuestion: (testId: string, questionId: string, updates: Partial<Question>) => void;
  deleteQuestion: (testId: string, questionId: string) => void;
  reorderQuestions: (testId: string, newOrder: string[]) => void;
  
  // Response actions
  saveResponse: (testId: string, responses: QuestionResponse[]) => TestResponse;
  getResponsesForTest: (testId: string) => TestResponse[];
}

// Mock data for tests
const mockTests: Test[] = [
  {
    id: uuidv4(),
    title: 'JavaScript Knowledge Assessment',
    description: 'Test your knowledge of JavaScript fundamentals',
    questions: [
      {
        id: uuidv4(),
        type: QuestionType.Section,
        title: 'JavaScript Basics',
        required: false,
        description: 'This section covers JavaScript fundamentals',
      },
      {
        id: uuidv4(),
        type: QuestionType.Choice,
        title: 'Which of the following is NOT a JavaScript data type?',
        required: true,
        options: [
          { id: uuidv4(), text: 'String' },
          { id: uuidv4(), text: 'Boolean' },
          { id: uuidv4(), text: 'Float' },
          { id: uuidv4(), text: 'Symbol' },
        ],
        allowMultiple: false,
      },
      {
        id: uuidv4(),
        type: QuestionType.Text,
        title: 'Explain the concept of closures in JavaScript',
        required: true,
        placeholder: 'Type your answer here...',
      },
      {
        id: uuidv4(),
        type: QuestionType.Rating,
        title: 'How confident are you with JavaScript promises?',
        required: true,
        maxRating: 5,
        labels: { start: 'Not confident', end: 'Very confident' },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Create the store
export const useTestStore = create<TestStore>((set, get) => ({
  tests: mockTests,
  activeTest: null,
  responses: [],
  
  createTest: (title, description) => {
    const newTest: Test = {
      id: uuidv4(),
      title,
      description,
      questions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      tests: [...state.tests, newTest],
    }));
    
    return newTest;
  },
  
  updateTest: (testId, updates) => {
    set((state) => ({
      tests: state.tests.map((test) =>
        test.id === testId
          ? { ...test, ...updates, updatedAt: new Date() }
          : test
      ),
      activeTest:
        state.activeTest?.id === testId
          ? { ...state.activeTest, ...updates, updatedAt: new Date() }
          : state.activeTest,
    }));
  },
  
  deleteTest: (testId) => {
    set((state) => ({
      tests: state.tests.filter((test) => test.id !== testId),
      activeTest: state.activeTest?.id === testId ? null : state.activeTest,
    }));
  },
  
  setActiveTest: (testId) => {
    if (testId === null) {
      set({ activeTest: null });
      return;
    }
    
    const test = get().tests.find((test) => test.id === testId) || null;
    set({ activeTest: test });
  },
  
  addQuestion: (testId, questionData) => {
    const question = {
      id: uuidv4(),
      ...questionData,
    } as Question;
    
    set((state) => ({
      tests: state.tests.map((test) =>
        test.id === testId
          ? {
              ...test,
              questions: [...test.questions, question],
              updatedAt: new Date(),
            }
          : test
      ),
      activeTest:
        state.activeTest?.id === testId
          ? {
              ...state.activeTest,
              questions: [...state.activeTest.questions, question],
              updatedAt: new Date(),
            }
          : state.activeTest,
    }));
  },
  
  updateQuestion: (testId: string, questionId: string, updates: Partial<Question>) => {
    set((state) => {
      const updateQuestionsInTest = (questions: Question[]): Question[] => {
        return questions.map((q) => {
          if (q.id !== questionId) return q;
          
          // Keep the question's original type
          const updatedQuestion = { ...q, ...updates, type: q.type };
          
          // Ensure type safety based on the question type
          switch (q.type) {
            case QuestionType.Choice:
              return updatedQuestion as ChoiceQuestion;
            case QuestionType.Text:
              return updatedQuestion as TextQuestion;
            case QuestionType.Rating:
              return updatedQuestion as RatingQuestion;
            case QuestionType.Date:
              return updatedQuestion as DateQuestion;
            case QuestionType.Ranking:
              return updatedQuestion as RankingQuestion;
            case QuestionType.Likert:
              return updatedQuestion as LikertQuestion;
            case QuestionType.UploadFile:
              return updatedQuestion as UploadFileQuestion;
            case QuestionType.NetPromoterScore:
              return updatedQuestion as NetPromoterScoreQuestion;
            case QuestionType.Section:
              return updatedQuestion as SectionQuestion;
            default:
              return q;
          }
        });
      };

      return {
        tests: state.tests.map(test => 
          test.id === testId 
            ? { ...test, questions: updateQuestionsInTest(test.questions), updatedAt: new Date() } 
            : test
        ),
        activeTest: state.activeTest?.id === testId
          ? { ...state.activeTest, questions: updateQuestionsInTest(state.activeTest.questions), updatedAt: new Date() }
          : state.activeTest
      };
    });
  },

  deleteQuestion: (testId, questionId) => {
    set((state) => ({
      tests: state.tests.map((test) =>
        test.id === testId
          ? {
              ...test,
              questions: test.questions.filter((q) => q.id !== questionId),
              updatedAt: new Date(),
            }
          : test
      ),
      activeTest:
        state.activeTest?.id === testId
          ? {
              ...state.activeTest,
              questions: state.activeTest.questions.filter(
                (q) => q.id !== questionId
              ),
              updatedAt: new Date(),
            }
          : state.activeTest,
    }));
  },
  
  reorderQuestions: (testId, newOrder) => {
    set((state) => {
      const test = state.tests.find((t) => t.id === testId);
      if (!test) return state;
      
      const questionsMap = new Map(
        test.questions.map((q) => [q.id, q])
      );
      
      const reorderedQuestions = newOrder
        .map((id) => questionsMap.get(id))
        .filter((q): q is Question => q !== undefined);
      
      return {
        tests: state.tests.map((t) =>
          t.id === testId
            ? {
                ...t,
                questions: reorderedQuestions,
                updatedAt: new Date(),
              }
            : t
        ),
        activeTest:
          state.activeTest?.id === testId
            ? {
                ...state.activeTest,
                questions: reorderedQuestions,
                updatedAt: new Date(),
              }
            : state.activeTest,
      };
    });
  },
  
  saveResponse: (testId, responses) => {
    const newResponse: TestResponse = {
      id: uuidv4(),
      testId,
      responses,
      submittedAt: new Date(),
    };
    
    set((state) => ({
      responses: [...state.responses, newResponse],
    }));
    
    return newResponse;
  },
  
  getResponsesForTest: (testId) => {
    return get().responses.filter((response) => response.testId === testId);
  },
}));