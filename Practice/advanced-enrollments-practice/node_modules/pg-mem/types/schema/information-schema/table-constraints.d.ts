import { _ITable } from '../../interfaces-private';
import { Schema } from '../../interfaces';
import { ReadOnlyTable } from '../readonly-table';
export declare class TableConstraints extends ReadOnlyTable implements _ITable {
    _schema: Schema;
    entropy(): number;
    enumerate(): Generator<never, void, unknown>;
    hasItem(value: any): boolean;
}
//# sourceMappingURL=table-constraints.d.ts.map