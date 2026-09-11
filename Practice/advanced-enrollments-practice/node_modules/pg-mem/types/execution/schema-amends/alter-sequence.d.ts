import { _Transaction, _IStatementExecutor, _IStatement } from '../../interfaces-private';
import { AlterSequenceStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class AlterSequence extends ExecHelper implements _IStatementExecutor {
    private p;
    private seq;
    constructor({ schema }: _IStatement, p: AlterSequenceStatement);
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
//# sourceMappingURL=alter-sequence.d.ts.map