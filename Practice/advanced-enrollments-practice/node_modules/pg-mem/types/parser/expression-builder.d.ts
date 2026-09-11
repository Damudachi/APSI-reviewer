import { _ISelection, IValue } from '../interfaces-private';
import { nil } from '../interfaces';
import { Expr, BinaryOperator } from 'pgsql-ast-parser';
export declare function buildValue(val: Expr): IValue;
export declare function uncache(data: _ISelection): void;
export declare function buildBinaryValue(leftValue: IValue, op: BinaryOperator, rightValue: IValue): IValue;
export declare function sqlSubstring(value: string, from?: number, len?: number | nil): string | null;
//# sourceMappingURL=expression-builder.d.ts.map