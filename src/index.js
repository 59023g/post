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

let getPosts = async () => {

  // get a key stream
  // check if existing key exists
  // if not, push to allKeys
  // if so, split the key and check which is newer
  //     and push new key (not split) to allKeys
  //     and remove old key from allKeys
  // then lookup data for keys
  // render layout

  let allKeys = []

  return new Promise( ( resolve, reject ) => {

    // this could be a key stream, but figured it'd be faster to include the body too, at least for now
    db.createReadStream()
      .on( 'data', function( item ) {

        console.log( item )

        let keyObj = util.splitKey( item.key )

        // get last key put into array
        let lastKey = util.lastArr( allKeys );

        if ( lastKey ) {

          lastKey = lastKey.key.split( config.splitValue );
          /*
            check if lastkey.createdAt == the newKey.createdAt -
            this means there may be an updated item
          */
          if ( lastKey[ 0 ] === keyObj.createdAt ) {

            // check if newKey updatedAt is newer in time
            if ( lastKey[ 1 ] < keyObj.updatedAt ) {

              // remove lastKey
              allKeys.pop();
              /*
                push newKey because it's newer and we don't want to display
                all edits on a page like index
              */
              allKeys.push( item )

            }

          } else {
            // if the item does not already exist, then push it
            allKeys.push( item );

          }

          // if there's no lastKey, new push the item
        } else {
          allKeys.push( item );

        }

      } )
      .on( 'error', function( err ) {
        reject( err )
      } )
      .on( 'end', function() {
        resolve( allKeys )
      } )

  } )
}
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
