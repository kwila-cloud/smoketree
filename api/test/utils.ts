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
    dump: () => db.dump(),
    close: () => db.close(),
  };
}