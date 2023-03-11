/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import '@testing-library/jest-dom/extend-expect';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalculatorContainer } from '../components/calculator/CalculatorContainer';

describe('Calculator component', () => {
  let container;
  beforeEach(() => {
    container = render(<CalculatorContainer />);
  });

  afterEach(cleanup);

  it('Calculator match snapshot', () => {
    expect(container).toMatchSnapshot();
  });

  it('+ operation', async () => {
    const user = userEvent.setup();
    const button1 = container.getByTestId('calculator-button-1');
    const button2 = container.getByTestId('calculator-button-2');
    const buttonPlus = container.getByTestId('calculator-button-+');
    const buttonExec = container.getByTestId('calculator-button-=');

    user.click(button1);
    user.click(buttonPlus);
    user.click(button2);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('3'));
  });

  it('- operation', async () => {
    const user = userEvent.setup();
    const button1 = container.getByTestId('calculator-button-5');
    const button2 = container.getByTestId('calculator-button-3');
    const buttonPlus = container.getByTestId('calculator-button--');
    const buttonExec = container.getByTestId('calculator-button-=');

    user.click(button1);
    user.click(buttonPlus);
    user.click(button2);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('2'));
  });

  it('* operation', async () => {
    const user = userEvent.setup();
    const button1 = container.getByTestId('calculator-button-5');
    const button2 = container.getByTestId('calculator-button-3');
    const buttonPlus = container.getByTestId('calculator-button-*');
    const buttonExec = container.getByTestId('calculator-button-=');

    user.click(button1);
    user.click(buttonPlus);
    user.click(button2);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('15'));
  });

  it('/ operation', async () => {
    const user = userEvent.setup();
    const button1 = container.getByTestId('calculator-button-1');
    const button6 = container.getByTestId('calculator-button-6');
    const button2 = container.getByTestId('calculator-button-4');
    const buttonPlus = container.getByTestId('calculator-button-/');
    const buttonExec = container.getByTestId('calculator-button-=');

    user.click(button1);
    user.click(button6);
    user.click(buttonPlus);
    user.click(button2);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('4'));
  });

  it('% operation', async () => {
    const user = userEvent.setup();
    const button2 = container.getByTestId('calculator-button-2');
    const button0 = container.getByTestId('calculator-button-0');
    const button8 = container.getByTestId('calculator-button-8');
    const opeartionBtn = container.getByTestId('calculator-button-%');
    const buttonExec = container.getByTestId('calculator-button-=');

    user.click(button2);
    user.click(button0);
    user.click(opeartionBtn);
    user.click(button8);
    user.click(button0);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('16'));
  });

  it('sqrt operation', async () => {
    const user = userEvent.setup();
    const button6 = container.getByTestId('calculator-button-6');
    const button4 = container.getByTestId('calculator-button-4');
    const opeartionBtn = container.getByTestId('calculator-button-\u221A');
    const buttonExec = container.getByTestId('calculator-button-=');
    user.click(button6);
    user.click(button4);
    user.click(opeartionBtn);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('8'));
  });

  it('clear all operation', async () => {
    const user = userEvent.setup();
    const button6 = container.getByTestId('calculator-button-6');
    const button4 = container.getByTestId('calculator-button-4');
    const buttonClear = container.getByTestId('calculator-button-C');
    const opeartionBtn = container.getByTestId('calculator-button-+');
    user.click(button6);
    user.click(opeartionBtn);
    user.click(button4);
    user.click(buttonClear);
    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe(''));
  });

  it('float number operation', async () => {
    const user = userEvent.setup();
    const button6 = container.getByTestId('calculator-button-6');
    const button4 = container.getByTestId('calculator-button-4');
    const button0 = container.getByTestId('calculator-button-0');
    const divider = container.getByTestId('calculator-button-.');
    const buttonExec = container.getByTestId('calculator-button-=');
    const opeartionBtn = container.getByTestId('calculator-button-+');
    user.click(button0);
    user.click(divider);
    user.click(button6);
    user.click(opeartionBtn);
    user.click(button0);
    user.click(divider);
    user.click(button4);
    user.click(buttonExec);
    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('1'));
  });

  it('operation with brakets', async () => {
    const user = userEvent.setup();
    const button6 = container.getByTestId('calculator-button-6');
    const button4 = container.getByTestId('calculator-button-4');
    const braketOpen = container.getByTestId('calculator-button-(');
    const braketClose = container.getByTestId('calculator-button-)');
    const buttonExec = container.getByTestId('calculator-button-=');
    const opeartionPlus = container.getByTestId('calculator-button-+');
    const opeartionMinus = container.getByTestId('calculator-button--');

    user.click(button6);
    user.click(opeartionPlus);
    user.click(braketOpen);
    user.click(button6);
    user.click(opeartionMinus);
    user.click(button4);
    user.click(braketClose);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('8'));
  });

  it('priority operations', async () => {
    const user = userEvent.setup();
    const button6 = container.getByTestId('calculator-button-6');
    const button4 = container.getByTestId('calculator-button-4');
    const buttonExec = container.getByTestId('calculator-button-=');
    const opeartionPlus = container.getByTestId('calculator-button-+');
    const opeartionMinus = container.getByTestId('calculator-button--');
    const opeartionMultipe = container.getByTestId('calculator-button-*');

    user.click(button6);
    user.click(opeartionPlus);
    user.click(button6);
    user.click(opeartionMultipe);
    user.click(button4);
    user.click(opeartionMinus);
    user.click(button4);
    user.click(buttonExec);

    const answerBox = await container.findByTestId('calculator-answer');
    await waitFor(() => expect(answerBox.textContent).toBe('26'));
  });
});
