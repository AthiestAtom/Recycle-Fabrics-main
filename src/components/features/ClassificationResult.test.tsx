import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ClassificationResult from './ClassificationResult';

const mockResult = {
  material: 'Organic Cotton',
  confidence: 95,
  recyclable: true,
  biodegradable: true,
  guidance: 'Compost or recycle through textile programs.',
  tips: ['Wash cold', 'Air dry'],
  environmental_impact: 'Low impact when organic.'
};

describe('ClassificationResult', () => {
  it('renders material name and confidence', () => {
    render(<ClassificationResult result={mockResult} />);
    expect(screen.getByText('Organic Cotton')).toBeInTheDocument();
    expect(screen.getByText('95%')).toBeInTheDocument();
  });

  it('renders recyclable and biodegradable badges when true', () => {
    render(<ClassificationResult result={mockResult} />);
    expect(screen.getByText(/Recyclable/i)).toBeInTheDocument();
    expect(screen.getByText(/Biodegradable/i)).toBeInTheDocument();
  });

  it('does not render badges when false', () => {
    const notRecyclableResult = { ...mockResult, recyclable: false, biodegradable: false };
    render(<ClassificationResult result={notRecyclableResult} />);
    expect(screen.queryByText(/Recyclable/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Biodegradable/i)).not.toBeInTheDocument();
  });

  it('renders guidance, tips and environmental impact', () => {
    render(<ClassificationResult result={mockResult} />);
    expect(screen.getByText(mockResult.guidance)).toBeInTheDocument();
    expect(screen.getByText(mockResult.environmental_impact)).toBeInTheDocument();
    mockResult.tips.forEach(tip => {
      expect(screen.getByText(tip)).toBeInTheDocument();
    });
  });
});
