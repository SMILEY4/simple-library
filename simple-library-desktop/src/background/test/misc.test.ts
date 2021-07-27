import {SQL} from "../persistence/sqlHandler";

test("sql is mocked correctly", async () => {
	expect(SQL.queryLibraryInfo()).toBe("SQL-MOCK");
});

