const databasePath = __dirname + '/db.json';
// Initialize low db an database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(databasePath);
const db = low(adapter);

// Export database to have access on it in routes
module.exports = { db };