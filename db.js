const config = require( './config.js' )

// database
const level = require( 'level' )
// const hyperlog = require( 'hyperlog' )


let db = level( config.DB_PATH, { valueEncoding: 'json' } )

// thought about a separate db, but i think for replicability, keep it in but encrypt the object
// let userDb = level( config.USER_DB_PATH, { valueEncoding: 'json' } )

module.exports = {
  db: db
}
