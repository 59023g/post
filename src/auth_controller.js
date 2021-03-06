// auth_controller.js

const jwt = require( 'jsonwebtoken' )

const utils = require( './utils.js' );
const usersDb = require( './db_driver.js' ).usersDb

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
  var token = req.body.token || req.query.token || req.headers[ 'x-access-token' ] || req.cookies.Token;

  // decode token
  if ( token ) {

    // verifies secret and checks exp
    jwt.verify( token, process.env.DEV_KEY, function ( err, decoded ) {
      if ( err ) {
        return res.json( {
          success: false,
          message: 'Failed to authenticate token.'
        } );
      } else {
        // if everything is good, save to request for use in other routes
        // console.log( 'sucess', decoded )
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

const deleteUser = async ( req, res ) => {
  usersDb.del( '', ( err ) => {
    console.log( 'del' )
  } );
}

const updateUser = '';


const setToken = async ( req, res ) => {

  jwt.sign( {
    foo: 'bar'
  }, process.env.DEV_KEY, {
    algorithm: 'HS256'
  }, function ( err, token ) {
    // TODO - if js on client, set localStorage

    // set cookie
    res.set( 'Authorization', token );
    res.cookie( 'Token', token, {
      maxAge: 9000000,
      httpOnly: true
    } )

    res.cookie( 'Author', req.body.author, {
      maxAge: 9000000,
      httpOnly: true
    } )

    // save token to user
    res.redirect( '/blog/admin' );

  } )
}

const login = async ( req, res ) => {
  let author = req.body.author || '';
  let pass = req.body.pass || '';

  if ( author === '' || pass === '' ) {
    res.status( 403 );
    res.json( 'Forbidden: 1' )
    return
  }

  let allAuthorItems = [];

  usersDb.createReadStream()
    .on( 'data', function ( item ) {
      // do the generic split key
      let keyObj = utils.splitKey( item.key );
      // if author matches key, push to array for later check
      if ( author === keyObj.author ) {
        allAuthorItems.push( Object.assign( keyObj, item.value ) );
      }
    } )
    .on( 'error', function ( err ) {
      reject( err )
    } )
    .on( 'end', function () {

      // author not found
      if ( allAuthorItems.length === 0 ) {
        res.status( 403 );
        res.json( 'Forbidden:2' )
        return
      }

      // sort by descending updatedAt, so latest is in 0
      allAuthorItems.sort( utils.sortDescUpdatedAt )
      let latestAuthorItem = allAuthorItems[ 0 ]

      // TODO - abstract out as setToken()
      if ( latestAuthorItem.pass === pass ) {
        // latest author item password matches
        // send token to client
        setToken( req, res );
      } else {
        // latest author item password does not match
        console.log( 'fail' )
        res.status( 403 );
        res.json( 'Forbidden: 3' )
        return
      }
    } )
}



module.exports = {
  login: login,
  deleteUser: deleteUser,
  verifyToken: verifyToken
}
