import { DataType, nil, RegClass, RegType, _IType } from '../interfaces-private';
import { TypeBase } from './datatype-base';
import { Evaluator } from '../evaluator';
export declare class RegTypeImpl extends TypeBase<RegType> {
    get primary(): DataType;
    doCanCast(_to: _IType): boolean | nil;
    doCast(a: Evaluator<RegType>, to: _IType): Evaluator;
    doCanBuildFrom(from: _IType): boolean;
    doBuildFrom(value: Evaluator, from: _IType): Evaluator<RegClass> | nil;
}
//# sourceMappingURL=t-regtype.d.ts.map