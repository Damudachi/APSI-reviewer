import { AggregationComputer, AggregationGroupComputer, IValue, _ISelection, _IType, _Transaction } from '../../interfaces-private';
import { ExprCall } from 'pgsql-ast-parser';
declare class ArrayAggExpr implements AggregationComputer<any[]> {
    private exp;
    constructor(exp: IValue);
    get type(): _IType<any>;
    createGroup(t: _Transaction): AggregationGroupComputer<any[]>;
}
export declare function buildArrayAgg(this: void, base: _ISelection, call: ExprCall): ArrayAggExpr;
export {};
//# sourceMappingURL=array_agg.d.ts.map