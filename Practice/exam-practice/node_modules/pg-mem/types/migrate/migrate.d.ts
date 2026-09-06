import { _ISchema } from '../interfaces-private';
import { MigrationData, MigrationParams } from './migrate-interfaces';
export declare function readMigrations(migrationPath?: string): Promise<MigrationData[]>;
/**
 * Migrates database schema to the latest version
 */
export declare function migrate(db: _ISchema, config?: MigrationParams): Promise<void>;
//# sourceMappingURL=migrate.d.ts.map