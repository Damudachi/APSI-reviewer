import { _IStatementExecutor, _Transaction, StatementResult, _IStatement, _ISelection, _ISchema } from '../interfaces-private';
import { WithStatementBinding, SelectStatement, WithStatement, ValuesStatement } from 'pgsql-ast-parser';
export declare function buildValues(p: ValuesStatement, acceptDefault?: boolean): _ISelection;
export declare function buildSelect(p: SelectStatement): _ISelection;
export declare function buildWith(p: WithStatement, topLevel: boolean): _ISelection;
export declare class SelectExec implements _IStatementExecutor {
    private statement;
    private p;
    readonly selection: _ISelection;
    constructor(statement: _IStatement, p: WithStatementBinding);
    get schema(): _ISchema;
    execute(t: _Transaction): StatementResult;
}
export declare const TYPE_SYMBOL: unique symbol;
//# sourceMappingURL=select.d.ts.map