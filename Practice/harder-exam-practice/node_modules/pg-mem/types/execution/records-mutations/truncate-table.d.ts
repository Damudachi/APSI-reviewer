import { _Transaction, _IStatementExecutor, StatementResult } from '../../interfaces-private';
import { TruncateTableStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../exec-utils';
export declare class TruncateTable extends ExecHelper implements _IStatementExecutor {
    private table;
    private opts;
    constructor(statement: TruncateTableStatement);
    execute(t: _Transaction): StatementResult;
}
//# sourceMappingURL=truncate-table.d.ts.map