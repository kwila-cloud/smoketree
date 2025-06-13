import Database from "better-sqlite3";

export function createTestDb() {
  const db = new Database(":memory:"); // Use in-memory database

  // Create the monthly_limit table
  db.exec(`
    CREATE TABLE IF NOT EXISTS monthly_limit (
      month TEXT NOT NULL,
      segment_limit INTEGER NOT NULL,
      updated_at TEXT NOT NULL,
      organization_uuid TEXT NOT NULL,
      PRIMARY KEY (month, organization_uuid)
    );
  `);

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