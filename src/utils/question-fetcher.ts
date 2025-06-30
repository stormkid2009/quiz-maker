// question-fetcher.ts
/**
 * Supported quiz question types for API requests.
 */
export type QuestionType =
  | "grammaire"
  | "situation"
  | "passage"
  | "composition"; // Add more types as needed

/**
 * Options for configuring question fetch requests.
 *
 * @interface FetchOptions
 * @property {RequestCache} [cache] - Cache strategy for fetch.
 * @property {HeadersInit} [headers] - Additional HTTP headers.
 * @property {number} [revalidate] - Revalidation time in seconds for ISR.
 */
interface FetchOptions {
  cache?: RequestCache;
  headers?: HeadersInit;
  revalidate?: number; // Add revalidate option
}

/**
 * Base function to fetch questions from the API
 * @param questionType - The type of question to fetch
 * @param options - Additional fetch options
 * @returns Promise resolving to question data or null
 */
async function fetchQuestion(
  questionType: QuestionType,
  options: FetchOptions = {}
) {
  // Skip API calls during build time
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    console.log(
      `Skipping ${questionType} fetch during build - no database available`
    );
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not defined");
    return null;
  }

  try {
    const fetchOptions: any = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    // Add cache options if specified
    if (options.cache) {
      fetchOptions.cache = options.cache;
    }

    // Add revalidate for ISR if specified
    if (options.revalidate !== undefined) {
      fetchOptions.next = { revalidate: options.revalidate };
    }

    const response = await fetch(
      `${baseUrl}/api/v1/${questionType}`,
      fetchOptions
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${questionType} question: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${questionType} question:`, error);
    return null;
  }
}

/**
 * Generic function to fetch any question type
 * @param questionType - The type of question to fetch
 */
export async function getQuestion(questionType: QuestionType) {
  return fetchQuestion(questionType);
}

/**
 * Fetch questions with static generation (for build time)
 * @param questionType - The type of question to fetch
 */
export async function getStaticQuestion(questionType: QuestionType) {
  return fetchQuestion(questionType, { cache: "force-cache" });
}

/**
 * Fetch questions with ISR (revalidate every hour)
 * @param questionType - The type of question to fetch
 */
export async function getRevalidatedQuestion(questionType: QuestionType) {
  return fetchQuestion(questionType, { revalidate: 3600 }); // 1 hour
}

/**
 * Fetch questions with no caching (dynamic)
 * @param questionType - The type of question to fetch
 */
export async function getDynamicQuestion(questionType: QuestionType) {
  return fetchQuestion(questionType, { cache: "no-store" });
}

/**
 * Fetch multiple questions of the same type
 * @param questionType - The type of questions to fetch
 * @param count - Number of questions to fetch
 */
export async function getMultipleQuestions(
  questionType: QuestionType,
  count: number = 5
) {
  try {
    const promises = Array(count)
      .fill(null)
      .map(() => fetchQuestion(questionType));

    const results = await Promise.all(promises);
    return results.filter((result) => result !== null);
  } catch (error) {
    console.error(`Error fetching multiple ${questionType} questions:`, error);
    return [];
  }
}

/**
 * Represents the data structure of a quiz question from the API.
 *
 * @interface QuestionData
 * @property {string} id - Unique question identifier.
 * @property {string} question - The question text.
 * @property {string[]} options - Array of answer options.
 * @property {string[]} rightAnswer - Array of correct answer key(s).
 * @property {string} [explanation] - Optional explanation for the correct answer.
 * @property {"easy"|"medium"|"hard"} [difficulty] - Optional difficulty level.
 */
export interface QuestionData {
  id: string;
  question: string;
  options: string[];
  rightAnswer: string[];
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

/**
 * Type guard to assert an object is valid QuestionData.
 *
 * @param {any} data - Data to validate.
 * @returns {data is QuestionData} True if data matches QuestionData.
 */
export function isValidQuestionData(data: any): data is QuestionData {
  return !!(
    data &&
    typeof data.id === "string" &&
    typeof data.question === "string" &&
    Array.isArray(data.options) &&
    Array.isArray(data.rightAnswer) &&
    data.rightAnswer.length > 0
  );
}
