const itemsDb = require( '../db.js' ).itemsDb;
const util = require( './util.js' );


// createUser
const createUser = async ( req ) => {



}

// getUser - create session if found
const getUser = async ( req ) => {


}


const newPost = async( req ) => {

  let content = req.body;
  // is this an id? and is it in the key or body
  let author = 'mp';
  let now = Date.now();

  itemsDb.put(
    now +
    '+' + now +
    '+' + author,
    content,  ( err ) => {
      if ( err ) return console.log( 'err', err )
      return Promise.resolve()
    }
  )

}

const updateItem = async( req ) => {

  let content = req.body;
  // this is the original creation of the post and is the master key for all edits
  let createdAt = req.body.createdAt
  // is this an id? and is it in the key or body
  let author = 'mp';
  let now = Date.now();

  // now needs to equal the original createdAt of post
  itemsDb.put(
    createdAt +
    '+' + now +
    '+' + author,
    content,  ( err ) => {
      if ( err ) return console.log( 'err', err )
      return Promise.resolve()
    }
  )

}


const getPosts = async () => {

  // get a key stream
  // check if existing key exists
  // if not, push to allKeys
  // if so, split the key and check which is newer
  //     and push new key (not split) to allKeys
  //     and remove old key from allKeys
  // then lookup data for keys
  // render layout

  let allItemsFilteredByUpdatedAt = []

  return new Promise( ( resolve, reject ) => {

    // this could be a key stream, but figured it'd be faster to include the body too, at least for now
    itemsDb.createReadStream( )
      .on( 'data', function( item ) {

        // console.log( 'posts', item )
        let keyObj = util.splitKey( item.key )

        // get last key put into array
        let lastKey = util.lastArrItem( allItemsFilteredByUpdatedAt );


        if ( lastKey ) {

          /*
            check if lastkey.createdAt == the newKey.createdAt -
            this means there may be an updated item
          */
          if ( lastKey.createdAt === keyObj.createdAt ) {

            // check if newKey updatedAt is newer in time
            if ( lastKey.updatedAt < keyObj.updatedAt ) {

              // remove lastKey
              allItemsFilteredByUpdatedAt.pop();
              /*
                push newKey because it's newer and we don't want to display
                all edits on a page like index
              */
              allItemsFilteredByUpdatedAt.push( Object.assign( keyObj, item.value ) )

            }

          } else {
            // if the item does not already exist, then push it
            allItemsFilteredByUpdatedAt.push( Object.assign( keyObj, item.value ) );

          }

          // if there's no lastKey, new push the item
        } else {
          allItemsFilteredByUpdatedAt.push( Object.assign( keyObj, item.value ) );

        }

      } )
      .on( 'error', function( err ) {
        console.log('err', err )
        reject( err )
      } )
      .on( 'end', function() {
        resolve( allItemsFilteredByUpdatedAt )
      } )

  } )
}


// TODO functionality for getting absolute post using createdAt and updtatedAt
// if updatedAt then get that
const getPost = async ( createdAt, updatedAt, author ) => {

  // get all posts createdAt request parameter

  let allItemsFilteredByCreatedAt = []

  return new Promise( ( resolve, reject ) => {

  itemsDb.createReadStream()
    .on( 'data', function( item ) {

      let keyObj = util.splitKey( item.key )

      if ( keyObj.createdAt === createdAt ) {
        // taking keyObj and assigning it to flattened item object
        // this is easier to work with than always splitting the key
        allItemsFilteredByCreatedAt.push( Object.assign( keyObj, item.value ) )
      }
    } )
      .on( 'error', function( err ) {
        reject( err )
      } )
      .on( 'end', function() {
        resolve( allItemsFilteredByCreatedAt )
      } )

  })
}


module.exports = {
  newPost: newPost,
  getPosts: getPosts,
  getPost: getPost,
  updateItem: updateItem
}
