import { _ISchema, _Transaction, _IStatementExecutor } from '../../interfaces-private';
import { CreateSequenceStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class ExecuteCreateSequence extends ExecHelper implements _IStatementExecutor {
    private p;
    private acceptTempSequences;
    schema: _ISchema;
    constructor(inSchema: _ISchema, p: CreateSequenceStatement, acceptTempSequences: boolean);
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
    createSeq(t: _Transaction): null;
}
//# sourceMappingURL=create-sequence.d.ts.map