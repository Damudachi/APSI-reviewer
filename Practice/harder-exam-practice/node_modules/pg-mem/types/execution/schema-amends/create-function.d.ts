import { _Transaction, _IStatement, _IStatementExecutor } from '../../interfaces-private';
import { CreateFunctionStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class CreateFunction extends ExecHelper implements _IStatementExecutor {
    private onSchema;
    private toRegister;
    private replace;
    constructor({ schema }: _IStatement, fn: CreateFunctionStatement);
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
//# sourceMappingURL=create-function.d.ts.map