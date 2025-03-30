import { QueryOperations } from '../types.js';
import { changeDateOffsetByAmount } from '../util/dateOffsetHelper.js';
import { refreshResults } from '../util/showResult.js';

export function handleChangeDateOffset (params: string[]): void {
  const { offsetChangeAmount } = JSON.parse(params.join(''));

  changeDateOffsetByAmount(offsetChangeAmount);

  let operation = QueryOperations.DATEOFFSET_MINUS;
  if (offsetChangeAmount > 0) {
    operation = QueryOperations.DATEOFFSET_PLUS;
  }

  refreshResults(operation);
}
