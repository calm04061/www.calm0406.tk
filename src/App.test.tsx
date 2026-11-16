import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// App renders <NavLink>, which requires a Router ancestor.
// MemoryRouter keeps the test independent from the real browser history.
test('renders navigation links pointing to each route', async () => {
  // Rendering inside an async act() lets the React.lazy chunks resolve
  // within the same flush, which keeps the Suspense transition warnings quiet.
  await act(async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  expect(await screen.findByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
  expect(screen.getByRole('link', { name: 'Users' })).toHaveAttribute('href', '/users');
});
