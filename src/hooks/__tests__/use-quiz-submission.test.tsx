import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useQuizSubmission } from '../use-quiz-submission';
import { Quiz as QuizType } from '@/shared/schemas/quiz';

describe('useQuizSubmission', () => {
  const mockQuiz: QuizType = {
    id: 'quiz1',
    title: 'Sample Quiz',
    questions: [],
    // Add other required fields if needed
  } as QuizType;

  const mockAnswers = { 'q1': ['0'], 'q2': ['1'] };
  const mockCalculateScore = jest.fn(() => 42);

  function TestComponent({ quiz, answers, calculateScore }: any) {
    const { submitted, score, handleSubmit } = useQuizSubmission({ quiz, answers, calculateScore });
    return (
      <div>
        <span data-testid="submitted">{submitted ? 'true' : 'false'}</span>
        <span data-testid="score">{score === null ? 'null' : score}</span>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    );
  }

  it('should initialize with not submitted and null score', () => {
    const { getByTestId } = render(
      <TestComponent quiz={mockQuiz} answers={mockAnswers} calculateScore={mockCalculateScore} />
    );
    expect(getByTestId('submitted').textContent).toBe('false');
    expect(getByTestId('score').textContent).toBe('null');
  });

  it('should set submitted to true and set score after handleSubmit', () => {
    const { getByTestId, getByText } = render(
      <TestComponent quiz={mockQuiz} answers={mockAnswers} calculateScore={mockCalculateScore} />
    );
    fireEvent.click(getByText('Submit'));
    expect(getByTestId('submitted').textContent).toBe('true');
    expect(getByTestId('score').textContent).toBe('42');
    expect(mockCalculateScore).toHaveBeenCalled();
  });
});
