import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { getSeasonalMoodBlock } from '../../utilities/seasonalMoodSystem';

test('renders quiet room prompt', () => {
  render(<App />);
  expect(screen.getByText(/A quiet room/i)).toBeTruthy();
  expect(screen.getByPlaceholderText(/Write a small thought/i)).toBeTruthy();
  expect(screen.getByText(/Reflections in Light Family/i)).toBeTruthy();
  expect(screen.getByLabelText(/Social media family drawer/i).className.includes('is-open')).toBe(false);
});

test('opens optional social media family drawer', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Social media family/i }));
  expect(screen.getByLabelText(/Social media family drawer/i).className.includes('is-open')).toBe(true);
  expect(screen.getByText(/Share Everywhere/i)).toBeTruthy();
  expect(screen.getByRole('button', { name: /Copy Caption \+ Hashtags/i })).toBeTruthy();
});

test('allows manual room colour changes', () => {
  const { container } = render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /Social media family/i }));
  fireEvent.click(screen.getByRole('button', { name: 'Warm' }));

  expect(container.querySelector('.App.mood-evening')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Warm' }).className.includes('is-selected')).toBe(true);
});

test('softens the orb glow on input focus', () => {
  const { container } = render(<App />);
  const input = screen.getByPlaceholderText(/Write a small thought/i);

  fireEvent.focus(input);
  expect(container.querySelector('.ambientOrb.is-focused')).toBeTruthy();
  expect(container.querySelector('.App.is-attending')).toBeTruthy();

  fireEvent.blur(input);
  expect(container.querySelector('.ambientOrb.is-focused')).toBeNull();
  expect(container.querySelector('.App.is-attending')).toBeNull();
});

test('maps time into seasonal mood blocks', () => {
  expect(getSeasonalMoodBlock(new Date('2026-06-03T07:00:00')).key).toBe('early-morning');
  expect(getSeasonalMoodBlock(new Date('2026-06-03T13:00:00')).key).toBe('afternoon');
  expect(getSeasonalMoodBlock(new Date('2026-06-03T18:00:00')).key).toBe('evening');
  expect(getSeasonalMoodBlock(new Date('2026-06-03T22:00:00')).key).toBe('night');
  expect(getSeasonalMoodBlock(new Date('2026-06-03T02:00:00')).key).toBe('deep-night');
});

test('lets a small thought pass', () => {
  jest.useFakeTimers();

  const { container } = render(<App />);
  const input = screen.getByPlaceholderText(/Write a small thought/i);

  fireEvent.change(input, { target: { value: 'Notice the breath' } });
  fireEvent.submit(input.closest('form'));

  expect(screen.getByText('Notice the breath')).toBeTruthy();
  expect(screen.queryByText(/A quiet room/i)).toBeNull();
  expect(container.querySelector('.App.has-active-thought')).toBeTruthy();

  act(() => {
    jest.advanceTimersByTime(8000);
  });

  expect(container.querySelector('.Thought.is-dissolving')).toBeTruthy();
  expect(screen.queryByText(/Letting go/i)).toBeNull();

  act(() => {
    jest.advanceTimersByTime(2500);
  });

  expect(container.querySelector('.Thought.is-letting-go')).toBeTruthy();
  expect(screen.getByText(/Letting go/i)).toBeTruthy();

  act(() => {
    jest.advanceTimersByTime(4500);
  });

  expect(screen.queryByText('Notice the breath')).toBeNull();
  expect(screen.getByText(/A quiet room/i)).toBeTruthy();
  expect(container.querySelector('.App.has-active-thought')).toBeNull();

  jest.useRealTimers();
});
