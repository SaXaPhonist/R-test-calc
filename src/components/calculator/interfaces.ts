export interface ICalcButton {
  value: string;
  type: 'operation' | 'number' | 'syntx' | 'clear';
  priority?: number;
}
