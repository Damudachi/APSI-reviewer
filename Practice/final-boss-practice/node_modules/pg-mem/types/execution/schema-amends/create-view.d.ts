import { _Transaction, _IStatement, _IStatementExecutor, _IView } from '../../interfaces-private';
import { CreateViewStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
import { View } from '../../schema/view';
export declare class CreateView extends ExecHelper implements _IStatementExecutor {
    private schema;
    private drop;
    existing: _IView | null;
    toRegister: View;
    constructor(st: _IStatement, p: CreateViewStatement);
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
//# sourceMappingURL=create-view.d.ts.map