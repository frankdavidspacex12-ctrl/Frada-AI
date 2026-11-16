export interface Dessert {
  id: string;
  name: string;
  price: number; // in COP
  stock: number;
  imageUrl: string;
  description?: string;
  flavorProfile?: string;
  category?: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  sublabel?: string;
  emoji?: string;
}

export interface Question {
  id: number;
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

export interface UserAnswer {
  questionId: number;
  question: string;
  selectedOption: string;
}

export interface RecommendationResult {
  dessertId: string;
  dessertName: string;
  personalityArchetype: string;
  motivationalMessage: string;
  matchReason: string;
  fromAI: boolean;
}
