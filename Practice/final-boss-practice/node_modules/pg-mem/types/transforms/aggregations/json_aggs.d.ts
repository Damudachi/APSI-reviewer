import { _ISelection, AggregationComputer, IValue, _IType, _Transaction, AggregationGroupComputer } from '../../interfaces-private';
import { ExprCall } from 'pgsql-ast-parser';
declare class JsonAggExpr implements AggregationComputer<any[]> {
    private exp;
    readonly type: _IType;
    constructor(exp: IValue, type: _IType);
    createGroup(t: _Transaction): AggregationGroupComputer<any[]>;
}
export declare function buildJsonAgg(this: void, base: _ISelection, call: ExprCall, fn: 'json_agg' | 'jsonb_agg'): JsonAggExpr;
export {};
//# sourceMappingURL=json_aggs.d.ts.map