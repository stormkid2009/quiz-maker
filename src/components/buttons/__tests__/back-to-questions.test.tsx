import React from 'react';
import { render } from '@testing-library/react';
import BackToQuestions from '../back-to-questions';
import Link from 'next/link';

describe('BackToQuestions', () => {
  it('renders a link to /training with correct text and class', () => {
    const { getByRole } = render(<BackToQuestions />);
    const link = getByRole('link', { name: /back to all questions/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/training');
    expect(link).toHaveClass('text-blue-600');
    expect(link).toHaveClass('hover:underline');
    expect(link).toHaveClass('mr-4');
  });
}); 