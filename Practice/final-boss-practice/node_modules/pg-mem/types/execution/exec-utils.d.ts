import { QName, Statement, NodeLocation } from 'pgsql-ast-parser';
import { _ISchema, _Transaction } from '../interfaces-private';
export declare function checkExistence(schema: _ISchema, name: QName, ifNotExists: boolean | undefined, act: () => void): boolean;
export declare function locOf(p: Statement): NodeLocation;
export declare abstract class ExecHelper {
    private statement;
    constructor(statement: Statement);
    protected noData(t: _Transaction, name?: string): {
        result: {
            command: string;
            fields: never[];
            rowCount: number;
            rows: never[];
            location: NodeLocation;
        };
        state: _Transaction;
    };
}
//# sourceMappingURL=exec-utils.d.ts.map