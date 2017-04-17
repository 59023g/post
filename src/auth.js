// const db = require( '../db_interactor.js' )
const config = require( '../config.js' );
const util = require( './util.js' );

const usersDb = require( '../db.js' ).usersDb

const secrets = require( '../secrets.js' );

const deleteUser = async( req, res ) => {
  // let key =

  usersDb.del( '', ( err ) => {
    console.log( 'del' )
  } )


}

const updateUser = '';

const createUser = async( req, res ) => {

  let now = Date.now();
  let user = req.body.user || '';
  let pass = req.body.pass || '';
  let email = req.body.email || '';

  if ( user === '' || pass === '' ) {
    // TODO dry responses
    // TODO tests
    res.status( 401 );
    res.json( {
      'status': 401
    } )
    return
  }

  return new Promise( ( resolve, reject ) => {

    usersDb.put(
      now +
      '+' + now +
      '+' + user, {
        user: user,
        pass: pass,
        email: email,
        bio: {
          name: ''
        }
      },
      ( err ) => {
        if ( err ) return reject( 'err', err )
        res.status( 200 );
        res.json( {
          'status': 200
        } )
        resolve()
      }
    )
  } )

}

const login = async( req, res ) => {
  let user = req.body.user || '';
  let pass = req.body.pass || '';

  if ( user === '' || pass === '' ) {
    res.status( 401 );
    res.json( {
      'status': 401
    } )
    return
  }

  let allAuthorItems = [];

  usersDb.createReadStream()
    .on( 'data', function( item ) {
      // do the generic split key
      let keyObj = util.splitKey( item.key );
      // if author matches key, push to array for later check
      if ( user === keyObj.author ) {
        allAuthorItems.push( Object.assign( keyObj, item.value ) );
      }
    } )
    .on( 'error', function( err ) {
      reject( err )
    } )
    .on( 'end', function() {


      // sort by descending updatedAt, so latest is in 0
      allAuthorItems.sort( util.sortDescUpdatedAt )

      let latestAuthorItem = allAuthorItems[ 0 ]
      if ( latestAuthorItem.pass === pass ) {
        // latest user item password matches
        // send token to client
        console.log('success')
      } else {
        // latest user item password does not match
        console.log( 'fail')
      }




    } )




}



module.exports = {
  login: login,
  createUser: createUser,
  deleteUser: deleteUser
}
