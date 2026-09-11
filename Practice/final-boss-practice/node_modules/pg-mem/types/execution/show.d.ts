import { _IStatementExecutor, _Transaction, StatementResult } from '../interfaces-private';
import { ShowStatement } from 'pgsql-ast-parser';
export declare class ShowExecutor implements _IStatementExecutor {
    private statement;
    constructor(statement: ShowStatement);
    execute(t: _Transaction): StatementResult;
}
//# sourceMappingURL=show.d.ts.map