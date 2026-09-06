import { Evaluator } from '../evaluator';
import { TypeBase } from './datatype-base';
import { DataType, nil } from '../interfaces';
import { _IType } from '../interfaces-private';
export declare class INetType extends TypeBase<string> {
    get primary(): DataType;
    doCanCast(to: _IType): boolean;
    doCast(value: Evaluator<string>, to: _IType<string>): Evaluator<any> | nil;
    prefer(type: _IType<any>): _IType | nil;
    doCanBuildFrom(from: _IType): boolean | nil;
    doBuildFrom(value: Evaluator<string>, from: _IType<string>): Evaluator<string> | nil;
}
//# sourceMappingURL=t-inet.d.ts.map