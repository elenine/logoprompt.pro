export interface Generation {
  model: string;
  imageUrl: string;
  generatedAt: string;
}

export interface LogoPrompt {
  id: string;
  prompt: string;
  category: string;
  createdAt: string;
  generations: Generation[];
}
