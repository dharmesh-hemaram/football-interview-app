import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card, CardBody, CardHeader } from '@components/common';

describe('Card', () => {
  it('renders children', () => {
    render(<Card><span>Card content</span></Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies card class', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).toHaveClass('card');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="h-100">content</Card>);
    expect(container.firstChild).toHaveClass('h-100');
  });

  it('calls onClick handler when clicked', () => {
    const handler = vi.fn();
    render(<Card onClick={handler}>Clickable</Card>);
    fireEvent.click(screen.getByText('Clickable'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('has pointer cursor when onClick provided', () => {
    const { container } = render(<Card onClick={() => {}}>content</Card>);
    expect(container.firstChild).toHaveStyle({ cursor: 'pointer' });
  });
});

describe('CardBody', () => {
  it('renders children with card-body class', () => {
    const { container } = render(<CardBody>Body content</CardBody>);
    expect(screen.getByText('Body content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('card-body');
  });
});

describe('CardHeader', () => {
  it('renders children with card-header class', () => {
    const { container } = render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('card-header');
  });
});
