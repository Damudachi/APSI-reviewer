import { _Transaction, _IStatementExecutor, _IStatement } from '../../interfaces-private';
import { AlterEnumType } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class AlterEnum extends ExecHelper implements _IStatementExecutor {
    private p;
    private onSchema;
    private originalEnum;
    constructor({ schema }: _IStatement, p: AlterEnumType);
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
//# sourceMappingURL=alter-enum.d.ts.map