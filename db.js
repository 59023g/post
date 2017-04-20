// database
const Level = require( 'level' )
const SubLevel = require( 'level-sublevel' )

// const hyperlog = require( 'hyperlog' )


let db = SubLevel( Level( process.env.DB_PATH, { valueEncoding: 'json' } ) );

let usersDb = db.sublevel( 'users' );
let itemsDb = db.sublevel( 'items' );

// thought about a separate db, but i think for replicability, keep it in but encrypt the object
// let userDb = level( process.env.USER_DB_PATH, { valueEncoding: 'json' } )

module.exports = {
  usersDb: usersDb,
  itemsDb: itemsDb
}
