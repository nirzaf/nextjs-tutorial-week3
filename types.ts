
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

export interface ParagraphElement {
  type: 'paragraph';
  content: string; // Contains raw markdown for inline elements initially
}

export interface CodeElement {
  type: 'code';
  language: string;
  code: string;
}

export interface HeaderElement {
  type: 'header';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  content: string;
}

export interface ListElement {
  type: 'list';
  ordered: boolean;
  items: string[]; // Items are strings, may contain raw inline markdown
}

export interface BlockquoteElement {
  type: 'blockquote';
  content: string; // May contain raw inline markdown
}

export interface HorizontalRuleElement {
  type: 'hr';
}

export type ContentElement =
  | ParagraphElement
  | CodeElement
  | HeaderElement
  | ListElement
  | BlockquoteElement
  | HorizontalRuleElement;

export interface Topic {
  id: string;
  title: string;
  path: string;
  explanation: ContentElement[];
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
    