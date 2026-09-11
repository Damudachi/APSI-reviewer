import { _IStatementExecutor, _Transaction, StatementResult, _IStatement } from '../../interfaces-private';
import { DoStatement } from 'pgsql-ast-parser';
import { ExecHelper } from '../../execution/exec-utils';
export declare class DoStatementExec extends ExecHelper implements _IStatementExecutor {
    private compiled;
    constructor({ schema }: _IStatement, st: DoStatement);
    execute(t: _Transaction): StatementResult;
}
//# sourceMappingURL=do.d.ts.map