import { AggregationComputer, AggregationGroupComputer, IValue, _ISelection, _IType, _Transaction } from '../../interfaces-private';
import { ExprCall } from 'pgsql-ast-parser';
declare class AvgExpr implements AggregationComputer<number> {
    private exp;
    constructor(exp: IValue);
    get type(): _IType<any>;
    createGroup(t: _Transaction): AggregationGroupComputer<number>;
}
export declare function buildAvg(this: void, base: _ISelection, call: ExprCall): AvgExpr;
export {};
//# sourceMappingURL=avg.d.ts.map