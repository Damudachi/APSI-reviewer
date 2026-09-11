import { _Transaction, _IStatementExecutor, _IStatement } from '../../interfaces-private';
import { DropStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class DropSequence extends ExecHelper implements _IStatementExecutor {
    private seqs;
    constructor({ schema }: _IStatement, statement: DropStatement);
    execute(t: _Transaction): {
        result: {
            command: string;
            fields: never[];
            rowCount: number;
            rows: never[];
            location: import("pgsql-ast-parser").NodeLocation;
        };
        state: _Transaction;
    };
}
//# sourceMappingURL=drop-sequence.d.ts.map