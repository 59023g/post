const config = require( './config.js' )

// database
const level = require( 'level' )
const hyperlog = require( 'hyperlog' )
const promisify = require( 'then-levelup' )


let db = promisify( level( config.DB_PATH, {
  valueEncoding: 'json'
} ))

module.exports = db
