import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnalyzingState from './AnalyzingState';

describe('AnalyzingState', () => {
  it('renders analyzing text', () => {
    render(<AnalyzingState />);
    expect(screen.getByText(/Analyzing your fabric/i)).toBeInTheDocument();
  });

  it('renders initial step text', () => {
    render(<AnalyzingState />);
    expect(screen.getByText(/Capturing image details/i)).toBeInTheDocument();
  });
});
