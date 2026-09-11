import { _Transaction, _IStatementExecutor } from '../../interfaces-private';
import { CreateTableStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class ExecuteCreateTable extends ExecHelper implements _IStatementExecutor {
    private toDeclare;
    private ifNotExists;
    private name;
    private schema;
    constructor(p: CreateTableStatement);
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
//# sourceMappingURL=create-table.d.ts.map