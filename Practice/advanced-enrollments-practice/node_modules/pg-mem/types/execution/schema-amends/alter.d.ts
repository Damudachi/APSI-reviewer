import { _Transaction, _IStatementExecutor, _IStatement } from '../../interfaces-private';
import { AlterTableStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class Alter extends ExecHelper implements _IStatementExecutor {
    private p;
    private table;
    constructor({ schema }: _IStatement, p: AlterTableStatement);
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
//# sourceMappingURL=alter.d.ts.map