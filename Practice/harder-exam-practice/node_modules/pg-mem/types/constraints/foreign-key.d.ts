import { TableConstraintForeignKey } from 'pgsql-ast-parser';
import { _IConstraint, _ITable, _Transaction } from '../interfaces-private';
export declare class ForeignKey implements _IConstraint {
    readonly name: string;
    private unsubs;
    private table;
    private foreignTable;
    get db(): import("../interfaces-private")._IDb;
    get schema(): import("../interfaces-private")._ISchema;
    constructor(name: string);
    install(_t: _Transaction, cst: TableConstraintForeignKey, table: _ITable): this;
    uninstall(t: _Transaction): void;
}
//# sourceMappingURL=foreign-key.d.ts.map