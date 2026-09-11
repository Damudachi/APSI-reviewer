import { _Transaction, _IStatement, _IStatementExecutor } from '../../interfaces-private';
import { CreateEnumType } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class CreateEnum extends ExecHelper implements _IStatementExecutor {
    private onSchema;
    private values;
    private name;
    constructor({ schema }: _IStatement, st: CreateEnumType);
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
//# sourceMappingURL=create-enum.d.ts.map