export function sqlCreateTableItems(): string {
    return 'CREATE TABLE items (' +
        '  id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  full_path TEXT NOT NULL,' +
        '  hash TEXT NOT NULL,' +
        '  timestamp_imported INTEGER NOT NULL' +
        ');';
}

export function sqlInsertItem(fullPath: string, timestampImported: number, hash: string) {
    return 'INSERT INTO items ' +
        '(' +
        '    full_path,' +
        '    hash,' +
        '    timestamp_imported' +
        ') VALUES (' +
        '    "' + fullPath + '",' +
        '    "' + hash + '",' +
        '    ' + timestampImported + '' +
        ');';
}

export function sqlCreateTableMetadata(): string {
    return 'CREATE TABLE metadata (' +
        '  key TEXT NOT NULL,' +
        '  value TEXT,' +
        '  PRIMARY KEY (key, value)' +
        ');';
}

export function sqlInsertMetadataLibraryName(name: string): string {
    return 'INSERT INTO metadata VALUES ("library_name", "' + name + '");';
}

export function sqlInsertMetadataTimestampCreated(timestamp: number): string {
    return 'INSERT INTO metadata VALUES ("timestamp_created", "' + timestamp + '");';
}

export function sqlInsertMetadataTimestampLastOpened(timestamp: number): string {
    return 'INSERT INTO metadata VALUES ("timestamp_last_opened", "' + timestamp + '");';
}

export function sqlUpdateMetadataTimestampLastOpened(newTimestamp: number): string {
    return 'UPDATE metadata SET value = "' + newTimestamp + '" WHERE key = "timestamp_last_opened";';
}

export function sqlGetMetadataLibraryName(): string {
    return 'SELECT value FROM metadata WHERE key = "library_name";';
}

export function sqlGetGetAllMetadata(): string {
    return 'SELECT * FROM metadata;';
}