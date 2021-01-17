import {
    addRxPlugin,
    createRxDatabase,
    RxDatabase
} from 'rxdb';

addRxPlugin(require('pouchdb-adapter-leveldb')); // leveldown adapters need the leveldb plugin to work
const leveldown = require('leveldown');

type LibraryMeta = {
    path: string,
    db: any
}

let currentLibraryMeta: LibraryMeta | undefined = undefined

export function loadLibrary(path: string): void {
    currentLibraryMeta = {
        path: path,
        db: createRxDatabase({
            name: path,
            adapter: leveldown,
            multiInstance: false
        })
    }
}


export function closeCurrentLibrary(): void {
    currentLibraryMeta = undefined
}