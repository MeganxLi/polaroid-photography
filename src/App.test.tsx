import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { FILTERS } from './constants';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('data:image/png;base64,fake-image-data'),
  }),
}));

// Mock URL.createObjectURL for URL testing if needed
window.URL.createObjectURL = vi.fn() as any;

// Mock standard MediaDevices API
const mockGetUserMedia = vi.fn();
Object.defineProperty(window.navigator, 'mediaDevices', {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

describe('App Component Core Features', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserMedia.mockReset();
  });

  it('renders the initial UI correctly', () => {
    render(<App />);
    expect(screen.getByText('Polaroidly')).toBeInTheDocument();
    expect(screen.getByText('操作說明')).toBeInTheDocument();
    expect(screen.getByText('選擇濾鏡')).toBeInTheDocument();
  });

  it('toggles the instruction modal', async () => {
    render(<App />);
    const instructionBtn = screen.getByText('操作說明');
    
    // Open modal
    fireEvent.click(instructionBtn);
    expect(screen.getByText('取得相片')).toBeInTheDocument();
    
    // Close modal
    const closeBtn = screen.getByText('我知道了');
    fireEvent.click(closeBtn);
    
    await waitFor(() => {
      expect(screen.queryByText('取得相片')).not.toBeInTheDocument();
    });
  });

  it('changes filter selection', () => {
    render(<App />);
    
    // Default filter should be warm-vintage
    expect(screen.getByText('經典暖褐復古')).toBeInTheDocument();

    // Find the button for faded-film (the second one)
    const fadedFilmBtn = screen.getByTitle('褪色日系底片');
    fireEvent.click(fadedFilmBtn);

    // The text should update to reflect the new filter
    expect(screen.getByText('褪色日系底片')).toBeInTheDocument();
    
    // Verify the image container receives the new style 
    // (This might require a more specific query depending on how the style is applied)
    const capturedImage = screen.getByAltText('Captured');
    expect(capturedImage).toHaveStyle({ filter: FILTERS[1].cssFilter });
  });

  it('updates custom text', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Click to type...');
    
    expect(input).toHaveValue('Meow~');
    
    fireEvent.change(input, { target: { value: 'Hello World!' } });
    expect(input).toHaveValue('Hello World!');
  });

  it('triggers camera activation when clicking the camera body', async () => {
    // Setup mock to resolve successfully
    mockGetUserMedia.mockResolvedValueOnce({
      getTracks: () => [{ stop: vi.fn() }],
    });
    
    render(<App />);
    
    // Target the hidden button which actually handles the click
    const cameraTrigger = screen.getByTestId('camera-trigger');
    fireEvent.click(cameraTrigger);

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
      // The photo should be hidden while camera is active
      expect(screen.queryByAltText('Captured')).not.toBeInTheDocument();
    });
  });

  it('handles camera failure gracefully', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    // Setup mock to reject
    mockGetUserMedia.mockRejectedValueOnce(new Error('Permission denied'));
    
    render(<App />);
    
    const cameraTrigger = screen.getByTestId('camera-trigger');
    fireEvent.click(cameraTrigger);

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('無法存取相機，請確認權限設定。');
    });
    
    alertMock.mockRestore();
  });

  it('triggers download process', async () => {
    render(<App />);
    
    // We need to mock document.createElement for the link
    const linkMock = {
      click: vi.fn(),
      download: '',
      href: '',
    };
    vi.spyOn(document, 'createElement').mockReturnValue(linkMock as any);
    
    const downloadBtn = screen.getByTitle('下載合成相片');
    fireEvent.click(downloadBtn);

    // Wait for html2canvas to resolve and link to be clicked
    await waitFor(() => {
      expect(linkMock.click).toHaveBeenCalled();
      expect(linkMock.download).toMatch(/^polaroidly-\d+\.png$/);
    });
  });
});
