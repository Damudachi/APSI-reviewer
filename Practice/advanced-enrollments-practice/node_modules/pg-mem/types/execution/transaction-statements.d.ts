import { _IStatementExecutor, _Transaction, StatementResult } from '../interfaces-private';
import { ExecHelper } from './exec-utils';
import { CommitStatement, RollbackStatement, StartTransactionStatement, BeginStatement } from 'pgsql-ast-parser';
export declare class CommitExecutor extends ExecHelper implements _IStatementExecutor {
    constructor(statement: CommitStatement);
    execute(t: _Transaction): StatementResult;
}
export declare class RollbackExecutor extends ExecHelper implements _IStatementExecutor {
    constructor(statement: RollbackStatement);
    execute(t: _Transaction): StatementResult;
}
export declare class BeginStatementExec extends ExecHelper implements _IStatementExecutor {
    constructor(statement: BeginStatement | StartTransactionStatement);
    execute(t: _Transaction): StatementResult;
}
//# sourceMappingURL=transaction-statements.d.ts.map