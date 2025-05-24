
export interface QuizOption {
  id: string;
  text: string;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  correctAnswerId: string;
  explanation?: string; 
}

export interface Exercise {
  title: string;
  description: string;
  solutionHint?: string;
  miniTasks?: {
    task: string;
    code?: string;
    hint?: string;
  }[];
}

export interface Topic {
  id: string;
  title: string;
  path: string;
  explanation: string;
  codeExample: {
    description?: string;
    code: string;
    outputDescription?: string;
  };
  interactiveExample: {
    description: string;
    tasks?: string[]; 
  };
  exercise: Exercise;
  quiz: Quiz;
  keywords: string[];
}
    