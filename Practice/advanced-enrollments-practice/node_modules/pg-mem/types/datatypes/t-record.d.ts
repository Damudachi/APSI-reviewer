import { DataType, nil, _IType, _ISelection, _Transaction } from '../interfaces-private';
import { TypeBase } from './datatype-base';
import { RecordCol } from './datatypes';
import { Evaluator } from '../evaluator';
export declare class RecordType extends TypeBase<any> {
    readonly columns: readonly RecordCol[];
    static matches(type: _IType): type is RecordType;
    constructor(columns: readonly RecordCol[]);
    get primary(): DataType;
    doEquals(a: any, b: any): boolean;
    static from(selection: _ISelection): RecordType;
    /** Build a function that will transform a record of this type to a record of the target type  */
    transformItemFrom(source: _ISelection): ((raw: any, t: _Transaction, execId: string) => any) | null;
    doCanCast(to: _IType): boolean | nil;
    doCast(value: Evaluator<any>, to: _IType): Evaluator<any> | nil;
}
//# sourceMappingURL=t-record.d.ts.map