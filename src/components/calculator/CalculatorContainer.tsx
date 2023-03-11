/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Calculator } from './CalculatorView';
import { mathOperations, buttonsLibrary, keyMapper } from './dataHelper';
import { IButton, IButtonBraket, IButtonNumber, IButtonOperation } from './interfaces';

const EXPRESSION_SYMBOL_LIMIT = 25;

export const CalculatorContainer = () => {
  const [result, setResult] = useState('');
  const [lastButton, setLastButton] = useState<IButton>();
  const [lastNumber, setLastNumber] = useState<string>('');
  const [outputValue, setOutputValue] = useState<string>('');
  const [activeButton, setActiveButton] = useState('');
  const [expression, setExpression] = useState<
    Array<IButtonNumber | IButtonOperation | IButtonBraket>
  >([]);

  const errorHandler = (msg: string) => {
    setResult(msg);
    setLastButton(undefined);
    setExpression([]);
    setOutputValue('');
  };

  const extractValue = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'BUTTON') {
      const element = e.target as HTMLButtonElement;

      return element.querySelector('span')?.innerHTML;
    }
    if (tag === 'SPAN') {
      const element = e.target as HTMLParagraphElement;
      return element.innerText;
    }
    return '';
  };

  const combineNumber = (value: string) => {
    setLastNumber((prev) => `${prev}${value}`);
  };

  const clearAll = () => {
    setLastButton(undefined);
    setLastNumber('');
    setOutputValue('');
    setExpression([]);
    setResult('');
  };

  const checkPriority = (
    currentEl: IButtonOperation,
    stack: Array<IButtonOperation | IButtonBraket>,
  ) => {
    const lastOperation = stack[stack.length - 1];
    if (lastOperation) {
      return currentEl.priority < (lastOperation as IButtonOperation).priority;
    }
    return false;
  };

  const mathOperationCalculate = (operation: IButtonOperation, numbersStack: number[]) => {
    const lastIndx = numbersStack.length - 1;
    if (operation.value === '\u221A') {
      const mathResult = mathOperations[operation.value](numbersStack[lastIndx]);
      numbersStack.splice(lastIndx, 1, mathResult);
      return numbersStack;
    }
    const mathResult = mathOperations[operation.value](
      numbersStack[lastIndx - 1],
      numbersStack[lastIndx],
    );
    numbersStack.splice(numbersStack.length - 2, 2, mathResult);
    return numbersStack;
  };

  const calculateResult = useCallback(
    (expressionArr: Array<IButtonNumber | IButtonOperation | IButtonBraket>) => {
      let numbersStack: number[] = [];
      const operationsStack: Array<IButtonOperation | IButtonBraket> = [];
      for (let i = 0; i < expressionArr.length; i += 1) {
        const currentSymbol = expressionArr[i];
        if (currentSymbol.type === 'number') {
          numbersStack.push(parseFloat(currentSymbol.value));
        } else if (currentSymbol.type === 'operation') {
          const isNeedCalculate = checkPriority(currentSymbol, operationsStack);
          if (isNeedCalculate) {
            while (
              operationsStack[operationsStack.length - 1] &&
              Object.hasOwn(operationsStack[operationsStack.length - 1], 'priority') &&
              (operationsStack[operationsStack.length - 1] as IButtonOperation).priority >=
                currentSymbol.priority
            ) {
              const lastOperation = operationsStack.pop() as IButtonOperation;
              numbersStack = mathOperationCalculate(lastOperation, numbersStack);
            }
          }
          operationsStack.push(currentSymbol);
        } else if (currentSymbol.type === 'braket') {
          if (currentSymbol.value === '(') {
            operationsStack.push(currentSymbol);
          } else {
            while (operationsStack[operationsStack.length - 1].value !== '(') {
              const lastOperation = operationsStack.pop() as IButtonOperation;
              numbersStack = mathOperationCalculate(lastOperation, numbersStack);
            }
            operationsStack.splice(operationsStack.length - 1, 1);
          }
        }
      }
      if (operationsStack.length) {
        while (operationsStack.length) {
          const lastOperation = operationsStack.pop() as IButtonOperation;
          numbersStack = mathOperationCalculate(lastOperation, numbersStack);
        }
      }
      const isFinish = numbersStack.length === 1 && !operationsStack.length;
      if (isFinish) {
        return numbersStack[0];
      }
      throw new Error('Exit with error');
    },
    [],
  );

  const expressionConstructor = (value: string) => {
    if (expression.length >= EXPRESSION_SYMBOL_LIMIT) {
      errorHandler('LIMIT EXCEEDED');
      return;
    }
    const [button] = (buttonsLibrary as IButton[]).filter((btn) => btn.value === value);
    if (button.type === 'number' || button.type === 'divider') {
      if (lastButton && lastButton.type === 'divider' && button.type === 'divider') return;
      combineNumber(button.value);
      setOutputValue((prev) => `${prev}${button.value}`);
      setLastButton(button);
      return;
    }
    if ((button.type === 'operation' && button.priority) || button.type === 'braket') {
      if (
        !lastButton &&
        button.value !== '\u221A' &&
        button.value !== '-' &&
        button.type !== 'braket'
      )
        return;
      if (lastButton?.type === 'operation' && button.value !== '\u221A' && button.type !== 'braket')
        return;
      setLastButton(button);
      if (lastNumber) {
        setExpression((prev) => [
          ...prev,
          { value: lastNumber, type: 'number' },
          ...(button.type === 'operation'
            ? [
                {
                  value: button.value,
                  type: 'operation',
                  priority: button.priority,
                } as IButtonOperation,
              ]
            : [{ value: button.value, type: 'braket' } as IButtonBraket]),
        ]);
        setOutputValue((prev) => `${prev}${button.value}`);
        setLastNumber('');
        return;
      }
      setExpression((prev) => [
        ...prev,
        ...(button.type === 'operation'
          ? [
              {
                value: button.value,
                type: button.type,
                priority: button?.priority,
              } as IButtonOperation,
            ]
          : [{ value: button.value, type: button.type } as IButtonBraket]),
      ]);
      setOutputValue((prev) => `${prev}${button.value}`);
      setLastNumber('');
    }
    if (lastButton && button.type === 'exec') {
      if (lastNumber) {
        setExpression((prev) => [...prev, { value: lastNumber, type: 'number' }]);
      }
      setLastButton(button);
      setLastNumber('');
      return;
    }
    if (button.type === 'clear') {
      clearAll();
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.type === 'keydown') {
      const calcKey = keyMapper[e.key];
      if (!calcKey) return;
      setActiveButton(calcKey);
    }
    if (e.type === 'keyup') {
      setActiveButton('');
    }
  };

  useEffect(() => {
    if (activeButton) {
      expressionConstructor(activeButton);
    }
  }, [activeButton]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress, true);
    document.addEventListener('keyup', handleKeyPress, true);
  }, []);

  useLayoutEffect(() => {
    const getResults = () => {
      try {
        const mathResult = calculateResult(expression);
        if (mathResult) {
          setResult(mathResult.toString());
          setOutputValue(mathResult.toString());
          setLastNumber(mathResult.toString());
        }
        setLastButton(undefined);
        setExpression([]);
      } catch (err) {
        console.error(err);
        errorHandler('Syntax Error');
      }
    };

    if (lastButton?.type === 'exec') {
      getResults();
    }
  }, [lastButton, calculateResult, expression]);

  const handleClick = (e: React.MouseEvent) => {
    const value = extractValue(e);
    if (!value) return;
    expressionConstructor(value);
  };

  return (
    <Calculator
      calcValue={outputValue}
      result={result}
      handleClick={handleClick}
      activeButton={activeButton}
    />
  );
};
