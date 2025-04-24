// src/types/resume.ts

export type AnalysisResult = {
    strengths: string[];
    improvements: string[];
    score: number;
  };
  
  export type OptimizationResult = {
    suggestions: string;
    optimized_content: string;
  };