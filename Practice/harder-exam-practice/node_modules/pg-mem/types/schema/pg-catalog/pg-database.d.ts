import { _ITable, _Transaction } from '../../interfaces-private';
import { Schema } from '../../interfaces';
import { ReadOnlyTable } from '../readonly-table';
declare const IS_SCHEMA: unique symbol;
export declare class PgDatabaseTable extends ReadOnlyTable implements _ITable {
    get ownSymbol(): symbol;
    _schema: Schema;
    entropy(t: _Transaction): number;
    enumerate(): Generator<{
        oid: number;
        datname: string;
        [IS_SCHEMA]: boolean;
    }, void, unknown>;
    hasItem(value: any): boolean;
}
export {};
//# sourceMappingURL=pg-database.d.ts.map