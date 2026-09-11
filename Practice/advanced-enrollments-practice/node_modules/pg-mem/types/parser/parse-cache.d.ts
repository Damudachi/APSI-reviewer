import { Expr, Statement } from 'pgsql-ast-parser';
export declare function enableStatementLocationTracking(): void;
/** Parse an AST from SQL */
export declare function parseSql(sql: string): Statement[];
export declare function parseSql(sql: string, entry: 'expr'): Expr;
//# sourceMappingURL=parse-cache.d.ts.map