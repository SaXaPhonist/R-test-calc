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
    <main data-id="calculator-wrapper" className="calculator-wrapper">
      <div className="calculator">
        <div className="display">
          <section data-testid="calculator-answer" className="calculator__presentation-box">
            {result || calcValue}
          </section>
          <section className="calculator__input-container">{calcValue}</section>
        </div>
        <section className="calculator__buttons-container">
          {buttonsLibrary.map((button) => (
            <button
              key={button.value}
              type="button"
              onClick={handleClick}
              data-testid={`calculator-button-${button.value}`}
              id={`calculator-button-${button.value}`}
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
