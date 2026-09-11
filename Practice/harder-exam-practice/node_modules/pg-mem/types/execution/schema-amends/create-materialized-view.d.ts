import { _Transaction, _IStatement, _IStatementExecutor } from '../../interfaces-private';
import { CreateMaterializedViewStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class CreateMaterializedView extends ExecHelper implements _IStatementExecutor {
    private schema;
    private toRegister?;
    constructor(st: _IStatement, p: CreateMaterializedViewStatement);
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
//# sourceMappingURL=create-materialized-view.d.ts.map