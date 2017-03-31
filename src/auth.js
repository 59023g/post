// const db = require( '../db_interactor.js' )
const config = require( '../config.js' );
const util = require( './util.js' );

const db = require( '../db.js' )

const secrets = require( '../secrets.js' );

const createUser = async( req, res ) => {

  let now = Date.now();
  let user = req.body.user || '';
  let pass = req.body.pass || '';
  let email = req.body.email || '';

  if ( user === '' || pass === '' ) {
    // TODO dry responses
    // TODO tests
    res.status( 200 );
    res.json( {
      'status': 401
    } )
    return
  }

  console.log( user, pass )

  db.put(
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
      if ( err ) return console.log( 'err', err )
      // return Promise.resolve()
    }
  )

}

const login = async( req, res ) => {
  let user = req.body.user || '';
  let pass = req.body.pass || '';im

  if ( user === '' || pass === '' ) {
    res.status( 401 );
    res.json( {
      'status': 401
    } )
    return
  }

  db.createReadStream()
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
