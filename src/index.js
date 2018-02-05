const dotenv = require( 'dotenv' ).config();

// server ( express mostly for the router )
const express = require( 'express' )
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );

const app = express()
app.use( '/blog/public', express.static( process.cwd() + '/public' ) )
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.listen( process.env.PORT )
app.disable( 'x-powered-by' )
app.use( cookieParser() )

// routing debugger
app.use( ( req, res, next ) => {
  if ( req.url === '/favicon.ico' ) return
  console.log( JSON.stringify( req.method ), JSON.stringify( req.url ), 'body: ', JSON.stringify( req.body ), 'query: ', JSON.stringify( req.query ), 'cookies:', JSON.stringify( req.cookies ) + '\n' )
  next()
} )

// routes
app.use( '/blog', require( './routes' ) )
