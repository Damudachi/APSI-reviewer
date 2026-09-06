import { DataType, nil, RegClass, _IType } from '../interfaces-private';
import { TypeBase } from './datatype-base';
import { Evaluator } from '../evaluator';
export declare class RegClassImpl extends TypeBase<RegClass> {
    get primary(): DataType;
    doCanCast(_to: _IType): boolean | nil;
    doCast(a: Evaluator, to: _IType): Evaluator;
    doCanBuildFrom(from: _IType): boolean;
    doBuildFrom(value: Evaluator, from: _IType): Evaluator<RegClass> | nil;
}
//# sourceMappingURL=t-regclass.d.ts.map