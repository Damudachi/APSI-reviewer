import { DataType, nil, _IType } from '../interfaces-private';
import { TypeBase } from './datatype-base';
import { Evaluator } from '../evaluator';
export declare class TimeType extends TypeBase<string> {
    readonly primary: DataType.time | DataType.timetz;
    constructor(primary: DataType.time | DataType.timetz);
    get name(): string;
    doCanCast(to: _IType): true | null;
    doCanConvertImplicit(to: _IType): boolean;
    doCast(value: Evaluator, to: _IType): Evaluator<any>;
    doCanBuildFrom(from: _IType): boolean;
    doBuildFrom(value: Evaluator, from: _IType): Evaluator<string> | nil;
}
//# sourceMappingURL=t-time.d.ts.map