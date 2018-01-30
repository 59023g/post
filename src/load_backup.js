const Level = require( 'level' )
const SubLevel = require( 'level-sublevel' )
var zlib = require( 'zlib' )
var fs = require( 'fs' )
var through = require( 'through' )
var split = require( 'split' )

let db = SubLevel( Level( process.env.DB_PATH, { valueEncoding: 'json' } ) );

let usersDb = db.sublevel( 'users' );
let itemsDb = db.sublevel( 'items' );

fs.createReadStream( "./itemsDbBackup-1516690147835.log.gz" )
  .pipe( zlib.createGunzip() )
  .pipe( split() )
  // .pipe( through( function ( str ) {
  //   console.log( 'str', str )
  //   this.queue( JSON.parse( str ) )
  // } ) )
  // .pipe( itemsDb.createWriteStream() )
