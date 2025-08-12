import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from './Badge';

describe('Badge', () => {
  it('renders the badge icon and has the correct title for tooltip', () => {
    const mockBadge = {
      label: 'Elite Shooter',
      description: 'A lethal shooter from long range.',
      icon: '🎯',
    };

    render(<Badge badge={mockBadge} />);

    // Check if the icon is rendered
    expect(screen.getByText('🎯')).toBeInTheDocument();

    // Check if the title attribute (tooltip) is correct
    const badgeElement = screen.getByText('🎯').closest('div');
    expect(badgeElement).toHaveAttribute('title', 'Elite Shooter: A lethal shooter from long range.');
  });

  it('does not render the label text directly', () => {
    const mockBadge = {
      label: 'Elite Shooter',
      description: 'A lethal shooter from long range.',
      icon: '🎯',
    };

    render(<Badge badge={mockBadge} />);

    // Ensure the label text is not directly visible in the document
    expect(screen.queryByText('Elite Shooter')).not.toBeInTheDocument();
  });
});