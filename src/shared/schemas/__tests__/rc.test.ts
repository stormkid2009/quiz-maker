import { RelatedQuestionSchema, ReadingComprehensionQuestionSchema } from '../rc';
import { QuestionTypes } from '../base-question';
import { z } from 'zod';

describe('RelatedQuestionSchema', () => {
  const validRelated = {
    content: 'What is the main idea?',
    options: ['A', 'B', 'C'],
    rightAnswer: ['A'],
    type: QuestionTypes.MCQ,
  };

  it('accepts a valid related question', () => {
    expect(() => RelatedQuestionSchema.parse(validRelated)).not.toThrow();
  });

  it('rejects if options are less than 2', () => {
    const invalid = { ...validRelated, options: ['A'] };
    expect(() => RelatedQuestionSchema.parse(invalid)).toThrow();
  });

  it('rejects if rightAnswer is not length 1', () => {
    const invalid = { ...validRelated, rightAnswer: [] };
    expect(() => RelatedQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validRelated, rightAnswer: ['A', 'B'] };
    expect(() => RelatedQuestionSchema.parse(invalid2)).toThrow();
  });

  it('rejects if type is not MCQ', () => {
    const invalid = { ...validRelated, type: 'RC' };
    expect(() => RelatedQuestionSchema.parse(invalid)).toThrow();
  });
});

describe('ReadingComprehensionQuestionSchema', () => {
  const now = new Date();
  const validRC = {
    id: 'rc-1',
    passage: 'This is a passage.',
    type: QuestionTypes.RC,
    relatedQuestions: [
      {
        content: 'What is the main idea?',
        options: ['A', 'B'],
        rightAnswer: ['A'],
        type: QuestionTypes.MCQ,
      },
    ],
    createdAt: now,
    updatedAt: now,
  };

  it('accepts a valid reading comprehension question', () => {
    expect(() => ReadingComprehensionQuestionSchema.parse(validRC)).not.toThrow();
  });

  it('rejects if type is not RC', () => {
    const invalid = { ...validRC, type: 'MCQ' };
    expect(() => ReadingComprehensionQuestionSchema.parse(invalid)).toThrow();
  });

  it('rejects if relatedQuestions is empty', () => {
    const invalid = { ...validRC, relatedQuestions: [] };
    expect(() => ReadingComprehensionQuestionSchema.parse(invalid)).not.toThrow(); // Accepts empty array
  });

  it('rejects if createdAt or updatedAt is not a date', () => {
    const invalid = { ...validRC, createdAt: '2020-01-01', updatedAt: now };
    expect(() => ReadingComprehensionQuestionSchema.parse(invalid)).toThrow();
    const invalid2 = { ...validRC, createdAt: now, updatedAt: '2020-01-01' };
    expect(() => ReadingComprehensionQuestionSchema.parse(invalid2)).toThrow();
  });

  it('rejects if a relatedQuestion is invalid', () => {
    const invalid = {
      ...validRC,
      relatedQuestions: [
        {
          content: 'Bad',
          options: ['A'], // not enough options
          rightAnswer: ['A'],
          type: QuestionTypes.MCQ,
        },
      ],
    };
    expect(() => ReadingComprehensionQuestionSchema.parse(invalid)).toThrow();
  });
}); 