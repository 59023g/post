// database
const Level = require( 'level' )
const SubLevel = require( 'level-sublevel' )
var zlib = require( 'zlib' )
var fs = require( 'fs' )
var through = require( 'through' )
// const hyperlog = require( 'hyperlog' )


let db = SubLevel( Level( process.env.DB_PATH, { valueEncoding: 'json' } ) );

let usersDb = db.sublevel( 'users' );
let itemsDb = db.sublevel( 'items' );

// thought about a separate db, but i think for replicability, keep it in but encrypt the object
// let userDb = level( process.env.USER_DB_PATH, { valueEncoding: 'json' } )



var backingup = false
var userDbBackup = `./backups/userDb-${ Date.now() }.log.gz`
var itemsDbBackup = `./backups/itemsDb-${ Date.now() }.log.gz`

process.on( 'SIGINT', function () {
  if ( backingup ) return console.log( 'im already backing up' )

  console.log( 'backup started!' )

  var t = Date.now()

  // an example of backing up to a file.
  usersDb.createReadStream()
    .pipe( through( function ( obj ) {
      // depending on if you store binary data your serialization method could be msgpack.
      this.queue( JSON.stringify( obj ) + "\n" );
    } ) )
    .pipe( zlib.createGzip() )
    .pipe( fs.createWriteStream( userDbBackup ) )
    .on( "close", function () {
      console.log( `userDb backup complete. took ${ Date.now() - t } ms` );
    } )


  // an example of backing up to a file.
  itemsDb.createReadStream()
    .pipe( through( function ( obj ) {
      // depending on if you store binary data your serialization method could be msgpack.
      this.queue( JSON.stringify( obj ) + "\n" );
    } ) )
    .pipe( zlib.createGzip() )
    .pipe( fs.createWriteStream( itemsDbBackup ) )
    .on( "close", function () {
      backingup = false;
      console.log( `itemDb backup complete. took ${ Date.now() - t } ms` );

    } )

    // if these are promises then it'll work
    // process.exit()

} )




module.exports = {
  usersDb: usersDb,
  itemsDb: itemsDb
}
