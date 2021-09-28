# Documentations

 - Electron: https://www.electronjs.org/docs
 - React: https://reactjs.org/docs
 - SQLite: https://github.com/mapbox/node-sqlite3/wiki
 - Node-Exiftool: https://github.com/Sobesednik/node-exiftool
 - electron-better-ipc: https://github.com/sindresorhus/electron-better-ipc
 - Jest: https://jestjs.io/
 - react-virtualized: https://github.com/bvaughn/react-virtualized/tree/master/docs
 - Date-Picker: https://reactdatepicker.com
 - DateFormat: https://www.npmjs.com/package/dateformat
 - original boilerplate: https://github.com/abbl/electron-typescript-react-typeorm-sqlite-boilerplate


# Commands

    npm start

Starts your app in development mode using the same terminal for electron and webpack-dev-server

    npm run dist

Creates the final distributable application for the current target system 

    npm build

Bundles your app using production config.

    npm run build:dev

Bundles your app using development config.

    npm run package

Packages your app using electron-builder (config can be found in ./electron-builder.json)

    npm run start:dev

Starts webpack-dev-server.

    npm run start:electron

Starts electron instance in development mode.


# Changelog

### Release 0.3.0

 - Added ability to completely delete items from the library
 - Added button to open config file
 - Theme is saved in config file
 - Items can be opened with the default application
 - Collections in sidebar can be filtered
 - Rework UI-Layout,Design
 - added first custom icon
 - Refactoring / Optimisation
