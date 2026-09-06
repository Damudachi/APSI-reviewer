import { _IConstraint, _Transaction } from '../interfaces-private';
export declare class SubscriptionConstraint implements _IConstraint {
    readonly name: string;
    readonly uninstall: (t: _Transaction) => void;
    constructor(name: string, uninstall: (t: _Transaction) => void);
}
//# sourceMappingURL=subscription.d.ts.map