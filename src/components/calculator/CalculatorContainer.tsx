/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

import { useCallback, useLayoutEffect, useState } from 'react';
import { buttonsLibrary, Calculator } from './CalculatorView';

interface IMathOperations {
  [key: string]: (val1: number, val2: number) => number;
  '\u221A': (val1: number) => number;
}

const mathOperations: IMathOperations = {
  '+': (val1, val2) => val1 + val2,
  '-': (val1, val2) => val1 - val2,
  '*': (val1, val2) => val1 * val2,
  '/': (val1, val2) => val1 / val2,
  '\u221A': (val1) => Math.sqrt(val1),
  '%': (val1, val2) => (val1 * val2) / 100,
};

export const CalculatorContainer = () => {
  const [maxDepth, setMaxDepth] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [lastBraket, setLastBraket] = useState('');
  const [openBraketsCount, setOpenBraketsCount] = useState(0);
  const [closeBraketCount, setCloseBraketCount] = useState(0);
  const [lastNumber, setLastNumber] = useState<string>('');
  const [result, setResult] = useState<string | undefined>();
  const [expression, setExpression] = useState<
    Array<{ value: string; type: 'number' | 'operation' | 'syntx'; priority?: number }>
  >([]);
  const [lastVal, setLastVal] = useState<string | undefined>();

  const clearAll = () => {
    setInputValue('');
    setLastNumber('');
    setExpression([]);
    setMaxDepth(0);
    setCloseBraketCount(0);
    setOpenBraketsCount(0);
    setLastBraket('');
    setResult(undefined);
  };

  const addNumber = (newNumber: string) => {
    if (lastNumber) {
      setLastNumber((prev) => `${prev}${newNumber}`);
      setInputValue((prev) => `${prev}${newNumber}`);
      return;
    }
    setLastNumber(newNumber);
    setInputValue((prev) => `${prev}${newNumber}`);
  };

  const mathDepth = (
    expressionArray: Array<{
      value: string;
      priority?: number;
      type: 'number' | 'operation' | 'syntx';
    }>,
    depth: number,
  ) => {
    for (let i = depth; i >= 1; i -= 1) {
      for (let j = 0; j <= expressionArray.length; j += 1) {
        const currentEl = expressionArray[j];
        if (!currentEl) {
          break;
        }
        if (expressionArray.length === 1) {
          return expressionArray[0].value;
        }
        if (currentEl.type === 'syntx' && currentEl.value === '(') {
          const nestedArray = expressionArray.slice(j);
          const closeBraketIndx = nestedArray.findIndex(
            (el) => el.value === ')' && el.priority === currentEl.priority,
          );
          const nestedExpression = nestedArray.slice(1, closeBraketIndx);
          const mathResult = parseFloat(mathDepth(nestedExpression, depth - 1));
          expressionArray.splice(j, nestedExpression.length, {
            value: mathResult.toString(),
            type: 'number',
          });
          j = 0;
        } else if (currentEl.type === 'operation' && currentEl.value === '-' && j === 0) {
          const nextNum = parseFloat(expressionArray[j + 1].value);
          const mathResult = -nextNum;
          expressionArray.splice(j, 2, { value: mathResult.toString(), type: 'number' });
          j = 0;
        } else if (currentEl.type === 'operation' && currentEl.value === '\u221A') {
          const nextNum = parseFloat(expressionArray[j + 1].value);
          const mathResult = mathOperations[currentEl.value](nextNum);
          expressionArray.splice(j, 2, { value: mathResult.toString(), type: 'number' });
          j = 0;
        } else if (currentEl.type === 'operation' && currentEl.priority === i) {
          const prevNum = parseFloat(expressionArray[j - 1].value);
          const nextNum = parseFloat(expressionArray[j + 1].value);
          const mathResult = mathOperations[currentEl.value](prevNum, nextNum);
          expressionArray.splice(j - 1, 3, { value: mathResult.toString(), type: 'number' });
          j = 0;
        }
      }
    }
    return expressionArray[0].value;
  };

  const getReuslt = useCallback(() => {
    const resultCalc = mathDepth(expression, maxDepth);
    if (resultCalc) {
      setResult(resultCalc);
      setInputValue(resultCalc);
      setLastNumber(resultCalc);
    }
    setMaxDepth(0);
    setCloseBraketCount(0);
    setOpenBraketsCount(0);
    setLastBraket('');
  }, [expression, maxDepth]);

  useLayoutEffect(() => {
    if (lastVal && lastVal === '=') {
      getReuslt();
    }
  }, [lastVal, getReuslt]);

  const expressionConstructor = (value?: string) => {
    const [button] = buttonsLibrary.filter((btn) => btn.value === value);

    if (button.type === 'operation') {
      if (lastVal && Object.keys(mathOperations).includes(lastVal)) return;
      if (!lastNumber && button.value !== '\u221A' && button.value !== '-') return;
      if (button.value === '=') {
        if (lastNumber) {
          setExpression((prev) => [...prev, { value: lastNumber, type: 'number' }]);
        }
        return;
      }
      if (button.priority && maxDepth < button.priority) {
        setMaxDepth(button.priority);
      }
      if (lastNumber) {
        setExpression((prev) => [
          ...prev,
          { value: lastNumber, type: 'number' },
          { value: button.value, type: 'operation', priority: button.priority },
        ]);
        setInputValue((prev) => `${prev}${button.value}`);
        setLastNumber('');
        return;
      }
      setExpression((prev) => [
        ...prev,
        { value: button.value, type: 'operation', priority: button.priority },
      ]);
      setInputValue((prev) => `${prev}${button.value}`);
      return;
    }
    if (button.type === 'number') {
      if (button.value === '.' && lastVal === '.') {
        return;
      }
      addNumber(button.value);
    }
    if (button.type === 'syntx' && button.priority) {
      let bracketPriority: number;
      if (lastBraket === '(' && button.value === '(') {
        bracketPriority = maxDepth + 1;
        setMaxDepth(bracketPriority);
        setExpression((prev) => [
          ...prev,
          { value: button.value, type: 'syntx', priority: bracketPriority },
        ]);
        setInputValue((prev) => `${prev}${button.value}`);
        setLastBraket(button.value);
        setOpenBraketsCount((prev) => prev + 1);
      } else if (!lastBraket && button.value === '(') {
        bracketPriority = button.priority;
        setMaxDepth(bracketPriority);
        if (lastNumber) {
          setExpression((prev) => [
            ...prev,
            { value: lastNumber, type: 'number' },
            { value: button.value, type: 'syntx', priority: bracketPriority },
          ]);
          setLastNumber('');
        } else {
          setExpression((prev) => [
            ...prev,
            { value: button.value, type: 'syntx', priority: bracketPriority },
          ]);
        }
        setInputValue((prev) => `${prev}${button.value}`);
        setLastBraket(button.value);
        setOpenBraketsCount((prev) => prev + 1);
      } else if (lastBraket === '(' && button.value === ')') {
        if (lastNumber) {
          setExpression((prev) => [
            ...prev,
            { value: lastNumber, type: 'number' },
            { value: button.value, type: 'syntx', priority: maxDepth },
          ]);
          setLastNumber('');
        } else {
          setExpression((prev) => [
            ...prev,
            { value: button.value, type: 'syntx', priority: bracketPriority },
          ]);
        }
        setInputValue((prev) => `${prev}${button.value}`);
        setLastBraket(button.value);
        setCloseBraketCount((prev) => prev + 1);
      } else if (
        lastBraket === ')' &&
        button.value === ')' &&
        closeBraketCount < openBraketsCount
      ) {
        if (lastNumber) {
          setExpression((prev) => [
            ...prev,
            { value: lastNumber, type: 'number' },
            { value: button.value, type: 'syntx', priority: maxDepth - closeBraketCount },
          ]);
          setLastNumber('');
        } else {
          setExpression((prev) => [
            ...prev,
            { value: button.value, type: 'syntx', priority: bracketPriority },
          ]);
        }
        setInputValue((prev) => `${prev}${button.value}`);
        setLastBraket(button.value);
        setCloseBraketCount((prev) => prev + 1);
      } else {
        throw new Error('Syntax ERROR');
      }
    }
    if (button.type === 'clear') {
      clearAll();
    }
  };

  const extractValue = (e: React.MouseEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'DIV') {
      const element = e.target as HTMLButtonElement;
      return element.querySelector('p')?.innerText;
    }
    if (tag === 'P') {
      const element = e.target as HTMLParagraphElement;
      return element.innerText;
    }
    return undefined;
  };

  const handleClick = (e: React.MouseEvent) => {
    const value = extractValue(e);
    setLastVal(value);
    expressionConstructor(value);
  };

  const handleKeyPress = () => {};

  return (
    <Calculator
      calcValue={inputValue}
      result={result}
      handleClick={handleClick}
      handleKeyPress={handleKeyPress}
    />
  );
};
