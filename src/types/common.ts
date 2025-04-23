
// src/types/common.ts
export interface ApiResponse <T = unknown>{
    status: 'success' | 'error';
    message: string;
    data: T;  // Using unknown is safer than any
    details?: string; // Made optional with ? instead of | null | undefined
  }
  
  export interface Messages {
    success: string;
    failure: string;
    wrongMethod: string;
    invalidData: string;
  }