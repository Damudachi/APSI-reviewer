import { _IType, _ArgDefDetails, nil, IValue } from '../interfaces-private';
export interface HasSig {
    name: string;
    args: _ArgDefDetails[];
    argsVariadic?: _IType | nil;
}
export declare class OverloadResolver<T extends HasSig> {
    private implicitCastOnly;
    private byName;
    constructor(implicitCastOnly: boolean);
    add(value: T, replaceIfExists: boolean): void;
    getOverloads(name: string): T[];
    remove(value: T): void;
    resolve(name: string, args: IValue[]): nil | T;
    getExact(name: string, types: _IType[]): T | nil;
}
//# sourceMappingURL=overload-resolver.d.ts.map