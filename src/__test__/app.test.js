import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { createRoot } from 'react-dom/client';
import { ReactDOM } from 'react-dom';
import { App } from '../app';

describe('App component', () => {
  const initialApp = render(<App />);
 
it('App exist', () => {
    expect(initialApp).not.toBeNull();
  });

it('App renders without crashing', () => {
  render(<App />);
  const main = document.getElementsByClassName('calculator-wrapper')[0]
  main.setAttribute('data-testid', "calculator-wrapper");
  const mainElement = screen.getByTestId('calculator-wrapper');
  expect(mainElement).toHaveAttribute('data-testid');
  main.removeAttribute('data-testid')
});

})