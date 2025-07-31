import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

export function createTestDb() {
  const db = new Database(":memory:"); // Use in-memory database

  // Load and run schema.sql
  const schemaPath = path.join(__dirname, "../src/schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schema);


  // Mimic D1's DB binding interface
  return {
    prepare: (query: string) => {
      const statement = db.prepare(query);
      return {
        bind: (...params: any[]) => {
          return {
            all: async () => {
              const results = await statement.all(...params);
              return { results };
            },
            first: async () => {
              const row = await statement.get(...params);
              return row;
            },
            run: async () => {
              statement.run(...params);
            },
          };
        },
      };
    },
    seedOrganizations: (orgUuids: string[]) => {
      const insertOrg = db.prepare(`INSERT OR IGNORE INTO organization (uuid, name) VALUES (?, ?)`);
      const insertAdminKey = db.prepare(`INSERT OR IGNORE INTO api_key (key, type, organization_uuid) VALUES (?, ?, ?)`);
      const insertUserKey = db.prepare(`INSERT OR IGNORE INTO api_key (key, type, organization_uuid) VALUES (?, ?, ?)`);

      for (const uuid of orgUuids) {
        insertOrg.run(uuid, `Organization ${uuid}`);
        insertAdminKey.run(`${uuid}-admin`, 'admin', uuid);
        insertUserKey.run(`${uuid}-user`, 'user', uuid);
      }
    },
    batch: async (statements: any[]) => {
      for (const statement of statements) {
        await statement.run();
      }
    },
    dump: () => db.dump(),
    close: () => db.close(),
  };
}
