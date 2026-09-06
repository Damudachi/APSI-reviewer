import { _IConstraint, _IIndex, _ITable, _Transaction } from '../interfaces-private';
export declare class IndexConstraint implements _IConstraint {
    readonly name: string;
    readonly index: _IIndex;
    private table;
    constructor(name: string, index: _IIndex, table: _ITable);
    uninstall(t: _Transaction): void;
}
//# sourceMappingURL=index-cst.d.ts.map