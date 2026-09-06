import { _IConstraint, _Transaction } from '../interfaces-private';
export declare class ConstraintWrapper implements _IConstraint {
    private refs;
    private inner;
    constructor(refs: Map<string, _IConstraint>, inner: _IConstraint);
    get name(): string | import("../interfaces").nil;
    uninstall(t: _Transaction): void;
}
//# sourceMappingURL=wrapped.d.ts.map