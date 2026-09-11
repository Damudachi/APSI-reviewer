import { DataType, nil, _IType } from '../interfaces-private';
import { Interval } from 'pgsql-ast-parser';
import { TypeBase } from './datatype-base';
import { Evaluator } from '../evaluator';
export declare class IntervalType extends TypeBase<Interval> {
    get primary(): DataType;
    doCanBuildFrom(from: _IType): boolean;
    doBuildFrom(value: Evaluator, from: _IType): Evaluator<Interval> | nil;
    doEquals(a: Interval, b: Interval): boolean;
    doGt(a: Interval, b: Interval): boolean;
    doLt(a: Interval, b: Interval): boolean;
}
//# sourceMappingURL=t-interval.d.ts.map