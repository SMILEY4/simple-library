//==================//
//   COLLECTIONS    //
//==================//

export function sqlCreateTableCollections(): string {
    return 'CREATE TABLE collections (' +
        '  collection_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  collection_name TEXT NOT NULL' +
        ');';
}

export function sqlCreateTableCollectionItems(): string {
    return 'CREATE TABLE collection_items (' +
        '  collection_id INTEGER NOT NULL,' +
        '  item_id NOT NULL,' +
        '  PRIMARY KEY (collection_id, item_id)' +
        ');';
}

export function sqlAllCollections() {
    return 'SELECT * FROM collections;';
}

export function sqlInsertCollection(name: string) {
    return 'INSERT INTO collections (collection_name) VALUES ("' + name + '");';
}

export function sqlDeleteCollection(collectionId: number) {
    return 'DELETE FROM collections WHERE collection_id=' + collectionId + ';';
}

export function sqlUpdateCollection(collectionId: number, name: string) {
    return 'UPDATE collections SET collection_name="' + name + '" WHERE collection_id=' + collectionId + ';';
}

export function sqlAddItemToCollection(collectionId: number, itemId: number) {
    return 'INSERT INTO collection_items (collection_id, item_id) VALUES (' + collectionId + ',' + itemId + ');';
}

//==================//
//      ITEMS       //
//==================//

export function sqlCreateTableItems(): string {
    return 'CREATE TABLE items (' +
        '  item_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        '  filepath TEXT NOT NULL,' +
        '  timestamp_imported INTEGER NOT NULL,' +
        '  hash TEXT NOT NULL,' +
        '  thumbnail TEXT NOT NULL' +
        ');';
}

export function sqlInsertItem(filepath: string, timestamp: number, hash: string, thumbnail: string) {
    return 'INSERT INTO items ' +
        '(' +
        '    filepath,' +
        '    timestamp_imported,' +
        '    hash,' +
        '    thumbnail' +
        ') VALUES (' +
        '    "' + filepath + '",' +
        '    ' + timestamp + ',' +
        '    "' + hash + '",' +
        '    "' + thumbnail + '"' +
        ');';
}

export function sqlAllItems() {
    return "SELECT * FROM items;";
}


//==================//
//     LIBRARY      //
//==================//

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

export function sqlAllMetadata(): string {
    return 'SELECT * FROM metadata;';
}