// const db = require( '../db_interactor.js' )
const config = require( '../config.js' );
const util = require( './util.js' );

const usersDb = require( '../db.js' ).usersDb

const secrets = require( '../secrets.js' );

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
    user +
    '+' + now +
    '+' + now, {
      user: user,
      pass: pass,
      email: email,
      bio: {
        name: 'mp'
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
})

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

  usersDb.createReadStream()
    .on( 'data', function( item ) {

      console.log( 'tiem', item )
    } )
    .on( 'error', function( err ) {
      reject( err )
    } )
    .on( 'end', function() {
      // resolve( allItemsFilteredByCreatedAt )
    } )




}


module.exports = {
  login: login,
  createUser: createUser
}
