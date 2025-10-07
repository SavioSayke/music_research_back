// src/question/entities/question.entity.ts
export class Question {
  id: number;
  description: string;
  options?: string[] | number[]; // Array de strings ou números para múltipla escolha
}
