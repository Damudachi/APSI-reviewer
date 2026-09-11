import { Evaluator } from '../evaluator';
import { TypeBase } from './datatype-base';
import { DataType, nil } from '../interfaces';
import { _IRelation, _ISchema, _IType, _Transaction } from '../interfaces-private';
export declare function asEnum(o: _IRelation | null): CustomEnumType;
export declare class CustomEnumType extends TypeBase<string> {
    readonly schema: _ISchema;
    private readonly _name;
    readonly values: string[];
    get primary(): DataType;
    get name(): string;
    constructor(schema: _ISchema, _name: string, values: string[]);
    install(): void;
    doCanCast(to: _IType): boolean;
    doCast(value: Evaluator<string>, to: _IType<string>): Evaluator<any> | nil;
    prefer(type: _IType<any>): _IType | nil;
    doCanBuildFrom(from: _IType): boolean | nil;
    doBuildFrom(value: Evaluator<string>, from: _IType<string>): Evaluator<string> | nil;
    drop(t: _Transaction): void;
}
//# sourceMappingURL=t-custom-enum.d.ts.map