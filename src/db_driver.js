// database
const level = require( 'level' )
const subLevel = require( 'level-sublevel' )
var zlib = require( 'zlib' )
var fs = require( 'fs' )
var through = require( 'through' )
// const hyperlog = require( 'hyperlog' )

let db = subLevel( level( process.env.DB_PATH, { valueEncoding: 'json' } ) )
let usersDb = db.sublevel( 'users' )
let itemsDb = db.sublevel( 'items' )


// backup on SIGINT!
let backingup = false
let promiseArr = []
const userDbBackup = `./backups/userDb-${ Date.now() }.log.gz`
const itemsDbBackup = `./backups/itemsDb-${ Date.now() }.log.gz`

process.on( 'SIGINT', function () {
  if ( backingup ) return console.log( 'im already backing up' )

  console.log( 'backup started!' )

  backingup = true

  try {
    const t = Date.now()

    promiseArr.push(
      new Promise( ( resolve, reject ) => {
          usersDb.createReadStream()
            .pipe( through( function ( obj ) {
              console.log( 'obj', obj )
              this.queue( JSON.stringify( obj ) + "\n" );
            } ) )
            .pipe( zlib.createGzip() )
            .pipe( fs.createWriteStream( userDbBackup ) )
            .on( "close", function () {
              resolve( `userDb: success: ${ Date.now() - t } ms` )
            } )
        }

      ) )

    promiseArr.push(
      new Promise( ( resolve, reject ) => {
        itemsDb.createReadStream()
          .pipe( through( function ( obj ) {
            this.queue( JSON.stringify( obj ) + "\n" );
          } ) )
          .pipe( zlib.createGzip() )
          .pipe( fs.createWriteStream( itemsDbBackup ) )
          .on( "close", function () {
            resolve( `itemsDb: success: ${ Date.now() - t } ms` )
          } )
      } ) )

  } catch ( error ) {
    console.error( 'error backup', error )
  }

  Promise.all( promiseArr )
    .then( ( results ) => {
      backingup = false;
      console.log( results )
      process.exit()
    } )


} )




module.exports = {
  usersDb: usersDb,
  itemsDb: itemsDb
}
