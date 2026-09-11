import { _Transaction, _IStatement, _IStatementExecutor } from '../../interfaces-private';
import { CreateIndexStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class CreateIndexExec extends ExecHelper implements _IStatementExecutor {
    private onTable;
    private indexDef;
    constructor({ schema }: _IStatement, p: CreateIndexStatement);
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
//# sourceMappingURL=create-index.d.ts.map