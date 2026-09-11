import { _Transaction, _IStatement, _IStatementExecutor } from '../../interfaces-private';
import { CreateSchemaStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class CreateSchema extends ExecHelper implements _IStatementExecutor {
    private st;
    private toCreate?;
    constructor(st: _IStatement, p: CreateSchemaStatement);
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
//# sourceMappingURL=create-schema.d.ts.map