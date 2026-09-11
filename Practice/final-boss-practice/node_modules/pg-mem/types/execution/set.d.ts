import { _IStatementExecutor, _Transaction, StatementResult } from '../interfaces-private';
import { SetGlobalStatement, SetTimezone, SetNames } from 'pgsql-ast-parser';
import { ExecHelper } from './exec-utils';
export declare class SetExecutor extends ExecHelper implements _IStatementExecutor {
    private p;
    constructor(p: SetGlobalStatement | SetTimezone | SetNames);
    execute(t: _Transaction): StatementResult;
}
//# sourceMappingURL=set.d.ts.map