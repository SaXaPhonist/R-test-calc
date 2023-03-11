export interface ICalcButton {
  value: string;
  type: 'operation' | 'number' | 'syntx' | 'clear';
  priority?: number;
}

export interface IMathOperations {
  [key: string]: (val1: number, val2: number) => number;
  '\u221A': (val1: number) => number;
}

export interface IButton {
  value: string;
  type: 'number' | 'operation' | 'exec' | 'braket' | 'divider' | 'clear';
  priority?: number;
}

export interface IButtonNumber extends Omit<IButton, 'type' | 'priority'> {
  type: 'number';
}

export interface IButtonOperation extends Omit<IButton, 'type' | 'priority'> {
  type: 'operation';
  priority: number;
}

export interface IButtonBraket extends Omit<IButton, 'type' | 'priority'> {
  type: 'braket';
}
