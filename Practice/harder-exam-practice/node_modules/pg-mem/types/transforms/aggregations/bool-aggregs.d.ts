import { _ISelection, AggregationComputer, IValue, _IType, _Transaction, AggregationGroupComputer } from '../../interfaces-private';
import { ExprCall } from 'pgsql-ast-parser';
declare class BoolAgg implements AggregationComputer<boolean> {
    private exp;
    private isOr;
    constructor(exp: IValue, isOr: boolean);
    get type(): _IType<any>;
    createGroup(t: _Transaction): AggregationGroupComputer<boolean>;
}
export declare function buildBoolAgg(this: void, base: _ISelection, call: ExprCall, fn: 'bool_and' | 'bool_or'): BoolAgg;
export {};
//# sourceMappingURL=bool-aggregs.d.ts.map