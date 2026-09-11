import { AggregationComputer, AggregationGroupComputer, IValue, _ISelection, _IType, _Transaction } from '../../interfaces-private';
import { Expr } from 'pgsql-ast-parser';
declare class MinMax implements AggregationComputer<number> {
    private exp;
    private isMax;
    constructor(exp: IValue, isMax: boolean);
    get type(): _IType<any>;
    createGroup(t: _Transaction): AggregationGroupComputer<number>;
}
export declare function buildMinMax(this: void, base: _ISelection, args: Expr[], op: 'max' | 'min'): MinMax;
export {};
//# sourceMappingURL=max-min.d.ts.map