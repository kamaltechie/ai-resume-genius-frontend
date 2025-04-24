// src/types/index.ts

export interface Resume {
    id: string | number;
    title: string;
    content: string;
    analysis?: AnalysisResult;
    optimized?: OptimizationResult;
  }
  
  export interface JobDescription {
    id: string | number;
    title: string;
    description: string;
  }
  
  export interface AnalysisResult {
    strengths: string[];
    improvements: string[];
    score: number;
  }
  
  export interface OptimizationResult {
    suggestions: string;
    optimized_content: string;
  }