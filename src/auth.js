const jwt = require( 'jsonwebtoken' )

// const db = require( '../db_interactor.js' )
const util = require( './util.js' );
const usersDb = require( '../db.js' ).usersDb

// http://stackoverflow.com/questions/34589272/how-to-set-authorization-headers-with-nodejs-and-express
const getToken = ( req ) => {
  if ( req.headers.authorization &&
    req.headers.authorization.split( ' ' )[ 0 ] === 'Bearer' ) {
    return req.headers.authorization.split( ' ' )[ 1 ];
  }
  return null;
}

const verifyToken = ( req, res, next ) => {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers[ 'x-access-token' ];

  // decode token
  if ( token ) {

    // verifies secret and checks exp
    jwt.verify( token, process.env.DEV_KEY, function( err, decoded ) {
      if ( err ) {
        return res.json( {
          success: false,
          message: 'Failed to authenticate token.'
        } );
      } else {
        // if everything is good, save to request for use in other routes
        console.log( 'sucess', decoded )
        req.decoded = decoded;
        next();
      }
    } );

  } else {

    // if there is no token
    // return an error
    return res.status( 403 ).send( {
      success: false,
      message: 'No token provided.'
    } );

  }
};

const deleteUser = async( req, res ) => {
  usersDb.del( '', ( err ) => {
    console.log( 'del' )
  } );
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
        jwt.sign( {
          foo: 'bar'
        }, process.env.DEV_KEY, {
          algorithm: 'HS256'
        }, function( err, token ) {
          res.json( {
            success: true,
            message: 'token',
            token: token
          } )
        } );
      } else {
        // latest user item password does not match
        console.log( 'fail' )
      }
    } )
}



module.exports = {
  login: login,
  createUser: createUser,
  deleteUser: deleteUser,
  verifyToken: verifyToken
}
