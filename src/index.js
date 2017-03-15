const config = require( '../config.js' )

// server
const micro = require( 'micro' );
const send = require( 'micro' ).send;
const json = require( 'micro' ).json;

// routes
const routes = require( './routes.js' )

// database
const db = require( '../db.js' )

// util
const qs = require( 'querystring' )
const url = require( 'url' )

// const promisify = require( 'es6-promisify' )
const parse = require( 'urlencoded-body-parser' );


async function getHandler( req, res, parsed ) {

  try {
    return await routes( parsed.pathname, req, res )
  } catch ( err ) {
    throw err
  }

}


async function postHandler( req, res, parsed ) {

  const content = await parse( req )

  switch ( parsed.pathname ) {
    case '/admin/post':

      // POST
      let author = 'mp'

      let now = Date.now()

      await db.put(
        Date.now() +
        '!' + now  +
        '!' + now  +
        '!' + author,
        content
      )

      send( res, 200, `${ JSON.stringify( data ) }` )

      break;
    default:
      send( res, 404, {
        status: 404,
        message: 'not found'
      } )

  }



  try {
    return await routes( parsed.pathname, req, res )
  } catch ( err ) {
    throw err
  }

}

async function methodHandler( req, res ) {
  const parsed = url.parse( req.url, true );

  try {
    switch ( req.method ) {
      case 'POST':
        return await postHandler( req, res, parsed );
      case 'GET':
        return await getHandler( req, res, parsed );
      default:
        send(
          res, 405, {
            status: 405,
            message: 'invalid method'
          } );
        break;
    }
  } catch ( err ) {
    throw err
  }

}

async function start() {
  server.listen( process.env.PORT );
}

const server = micro( async( req, res ) => {
  try {
    return await methodHandler( req, res );
  } catch ( err ) {
    micro.sendError( req, res, err );
  }
} );

start()
