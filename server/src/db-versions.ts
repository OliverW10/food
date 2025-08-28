import fs from "fs";
import path from "path";
import { db } from "./db";

async function getDbMigrations () {
    const applied: { migration_name: string}[] = await db.$queryRaw`SELECT * FROM _prisma_migrations`;
    return applied.map(r => r.migration_name);
}

async function getFileMigrations() {
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations');
    return fs.readdirSync(migrationsDir)
        .filter(file => fs.statSync(path.join(migrationsDir, file)).isDirectory());
}

async function checkMigrations() {
    const [dbMigrations, fileMigrations] = await Promise.all([
        getDbMigrations(),
        getFileMigrations()
    ]);

    const missingInDb = fileMigrations.filter(m => !dbMigrations.includes(m));
    const missingInFiles = dbMigrations.filter(m => !fileMigrations.includes(m));

    return {
        missingInDb,
        missingInFiles
    }
}

export { checkMigrations };
