import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import ImageUploader from './ImageUploader';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('ImageUploader', () => {
  const mockOnImageSelect = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders upload area when no image is selected', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage={null} onClear={mockOnClear} isAnalyzing={false} />);
    expect(screen.getByText(/Upload your fabric photo/i)).toBeInTheDocument();
  });

  it('handles file input change', async () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage={null} onClear={mockOnClear} isAnalyzing={false} />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Upload fabric image for classification/i);

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null as any,
    };
    vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);
    
    // Simulate onload
    mockFileReader.onload({ target: { result: 'data:image/png;base64,hello' } });
    
    expect(mockOnImageSelect).toHaveBeenCalledWith(file, 'data:image/png;base64,hello');
  });

  it('rejects unsupported file formats', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage={null} onClear={mockOnClear} isAnalyzing={false} />);

    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/Upload fabric image for classification/i);

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  it('rejects images larger than 10MB', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage={null} onClear={mockOnClear} isAnalyzing={false} />);

    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'huge.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Upload fabric image for classification/i);

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnImageSelect).not.toHaveBeenCalled();
  });

  it('renders image preview when image is selected', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage='data:image/png;base64,hello' onClear={mockOnClear} isAnalyzing={false} />);
    expect(screen.getByAltText(/Selected fabric/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear selected image/i })).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage='data:image/png;base64,hello' onClear={mockOnClear} isAnalyzing={false} />);
    fireEvent.click(screen.getByRole('button', { name: /Clear selected image/i }));
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('hides clear button when analyzing', () => {
    render(<ImageUploader onImageSelect={mockOnImageSelect} selectedImage='data:image/png;base64,hello' onClear={mockOnClear} isAnalyzing={true} />);
    expect(screen.queryByRole('button', { name: /Clear selected image/i })).not.toBeInTheDocument();
  });
});
