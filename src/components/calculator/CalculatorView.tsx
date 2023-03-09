import { buttonsLibrary } from './dataHelper';
import './styles.css';

interface IProps {
  calcValue: string;
  handleClick: (e: React.MouseEvent) => void;
  result: string | undefined;
  activeButton: string;
}

export const Calculator = ({ calcValue, result, handleClick, activeButton }: IProps) => {
  return (
    <main className="calculator-wrapper">
      <div className="calculator">
        <section className="calculator__presentation-box">{result || calcValue}</section>
        <input value={calcValue} className="calculator__input-container" />
        <section className="calculator__buttons-container">
          {buttonsLibrary.map((button, index) => (
            <button
              key={button.value}
              type="button"
              onFocus={() => {}}
              tabIndex={-index}
              onClick={handleClick}
              className={
                activeButton === button.value ? 'calculator__button active' : 'calculator__button'
              }
            >
              <span>{button.value}</span>
            </button>
          ))}
        </section>
      </div>
    </main>
  );
};
