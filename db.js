const config = require( './config.js' )

// database
const level = require( 'level' )
// const hyperlog = require( 'hyperlog' )


let db = level( config.DB_PATH, { valueEncoding: 'json' } )

module.exports = db
