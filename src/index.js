const config = require( '../config.js' )

// db
const db = require( '../db.js' )

// server ( express mostly for the router )
const app = require( 'express' )();
const bodyParser = require( 'body-parser' );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

app.listen( process.env.PORT )

// views
const views = require( './views.js' );

// routes
app.get( '/', function( req, res ) {

  let dataStreamArr = []

  db.createReadStream( {
      reverse: true
    } )
    .on( 'data', function( data ) {
      dataStreamArr.push( data )
    } )
    .on( 'error', function( err ) {
      console.log( 'Oh my!', err )
    } )
    .on( 'close', function() {
      console.log( 'Stream closed' )
    } )
    .on( 'end', function() {
      console.log( 'Stream ended' )
      res.send( views.getIndex( dataStreamArr ) )

    } )

} )

app.get( '/admin/post', ( req, res ) => {
  res.send( views.getForm() );
} )

app.post( '/admin/post', ( req, res ) => {

  let content = req.body;
  let author = 'mp';
  let now = Date.now();

  db.put(
    now +
    '+' + now +
    '+' + author,
    content
  )

  res.redirect( 200, '/');

} )
