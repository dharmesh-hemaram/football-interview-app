import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@components/common';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>FWD</Badge>);
    expect(screen.getByText('FWD')).toBeInTheDocument();
  });

  it('applies default variant class', () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.firstChild).toHaveClass('badge');
  });

  it('applies the correct variant class for success', () => {
    const { container } = render(<Badge variant="success">W 10</Badge>);
    expect(container.firstChild).toHaveClass('bg-success');
  });

  it('applies the correct variant class for danger', () => {
    const { container } = render(<Badge variant="danger">Red</Badge>);
    expect(container.firstChild).toHaveClass('bg-danger');
  });

  it('applies the correct variant class for info', () => {
    const { container } = render(<Badge variant="info">DEF</Badge>);
    expect(container.firstChild).toHaveClass('bg-info');
  });

  it('applies the correct variant class for warning', () => {
    const { container } = render(<Badge variant="warning">GK</Badge>);
    expect(container.firstChild).toHaveClass('bg-warning');
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="me-2">Text</Badge>);
    expect(container.firstChild).toHaveClass('me-2');
  });

  it('renders LIVE badge correctly', () => {
    render(<Badge variant="danger">🔴 LIVE</Badge>);
    expect(screen.getByText('🔴 LIVE')).toBeInTheDocument();
  });
});
