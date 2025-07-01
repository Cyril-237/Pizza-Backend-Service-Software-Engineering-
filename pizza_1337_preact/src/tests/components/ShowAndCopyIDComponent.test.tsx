import { render, fireEvent, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { ShowAndCopyIdComponent } from '../../components/ShowAndCopyIDComponent';

describe('ShowAndCopyIdComponent', () => {
  const defaultProps = {
    id: 'test-id-123',
    content: 'Test Content',
    type: 'test-type'
  };

  it('should show hover content on mouse enter and hide on mouse leave', () => {
    const { container } = render(<ShowAndCopyIdComponent {...defaultProps} />);

    // Get the main container
    const idContainer = container.querySelector('.id-container');
    expect(idContainer).toBeTruthy();

    // Initially, hover content should not be visible
    expect(container.querySelector('.hover-content')).toBeNull();

    // Simulate mouse enter
    fireEvent.mouseEnter(idContainer!);

    // Hover content should now be visible
    const hoverContent = container.querySelector('.hover-content');
    expect(hoverContent).toBeTruthy();
    expect(hoverContent?.textContent).toBe(`Click to copy id (${defaultProps.type}): ${defaultProps.id}`);

    // Simulate mouse leave
    fireEvent.mouseLeave(idContainer!);

    // Hover content should be hidden again
    expect(container.querySelector('.hover-content')).toBeNull();
  });

  it('should handle copy functionality when clicked', async () => {
    // Mock document.execCommand
    document.execCommand = vi.fn();

    const { container } = render(<ShowAndCopyIdComponent {...defaultProps} />);

    // Simulate mouse enter to show the hover content
    const idContainer = container.querySelector('.id-container');
    fireEvent.mouseEnter(idContainer!);

    // Click the copy button
    const copyButton = container.querySelector('.hover-content span');
    fireEvent.click(copyButton!);

    // Verify execCommand was called
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    // Verify hover content changed to "ID Copied to clipboard"
    expect(container.querySelector('.hover-content')?.textContent).toBe('ID Copied to clipboard');
  });

  it('should render without type', () => {
    const propsWithoutType = {
      id: 'test-id-123',
      content: 'Test Content'
    };

    const { container } = render(<ShowAndCopyIdComponent {...propsWithoutType} />);

    const idContainer = container.querySelector('.id-container');
    fireEvent.mouseEnter(idContainer!);

    const hoverContent = container.querySelector('.hover-content');
    expect(hoverContent?.textContent).toBe(`Click to copy id: ${propsWithoutType.id}`);
  });
});