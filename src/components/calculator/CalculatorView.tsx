import { ICalcButton } from './interfaces';
import './styles.css';

export const buttonsLibrary: ICalcButton[] = [
  { value: 'C', type: 'clear' },
  { value: '\u221A', type: 'operation', priority: 3 },
  { value: '%', type: 'operation', priority: 2 },
  { value: '/', type: 'operation', priority: 2 },
  { value: '1', type: 'number' },
  { value: '2', type: 'number' },
  { value: '3', type: 'number' },
  { value: '*', type: 'operation', priority: 2 },
  { value: '4', type: 'number' },
  { value: '5', type: 'number' },
  { value: '6', type: 'number' },
  { value: '-', type: 'operation', priority: 1 },
  { value: '7', type: 'number' },
  { value: '8', type: 'number' },
  { value: '9', type: 'number' },
  { value: '+', type: 'operation', priority: 1 },
  { value: '(', type: 'syntx', priority: 4 },
  { value: ')', type: 'syntx', priority: 4 },
  { value: '0', type: 'number' },
  { value: '.', type: 'number' },
  { value: '=', type: 'operation' },
];

interface IProps {
  calcValue: string;
  handleClick: (e: React.MouseEvent) => void;
  handleKeyPress: () => void;
  result: string | undefined;
}

export const Calculator = ({ calcValue, result, handleClick, handleKeyPress }: IProps) => {
  return (
    <div className="calculator-wrapper">
      <div className="calculator">
        <section className="calculator__presentation-box">{result || calcValue}</section>
        <input value={calcValue} className="calculator__input-container" />
        <section className="calculator__buttons-container">
          {buttonsLibrary.map((button) => (
            <div
              key={button.value}
              role="none"
              onFocus={() => {}}
              onKeyDown={handleKeyPress}
              onClick={handleClick}
              className="calculator__button"
            >
              <p>{button.value}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};
