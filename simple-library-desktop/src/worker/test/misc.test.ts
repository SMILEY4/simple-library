import {SQL} from "../persistence/sqlHandler";

test("sql files are mocked correctly", async () => {
	expect(SQL.queryLibraryInfo().replace(/(?:\r\n|\r|\n)/g, " "))
		.toBe("SELECT * FROM metadata;");
});

test("sql module builds queries correctly", async () => {
	expect(processQuery(SQL.queryGroupById(42)))
		.toBe("SELECT * FROM groups WHERE group_id = 42;");
});


function processQuery(query: string): string {
	return query
		.split(/(?:\r\n|\r|\n)/g)
		.filter(l => !l.trim().startsWith("--"))
		.join(" ");
}