const dotenv = require( 'dotenv' ).config();
const util = require( './util.js' );

// db
// const db = require( '../db.js' )
const db_interactor = require( './db_interactor.js' );

// auth
const auth = require( './auth.js' );
const jwt = require( 'jsonwebtoken' );

// server ( express mostly for the router )
const app = require( 'express' )();
const bodyParser = require( 'body-parser' );
const cookieParser = require('cookie-parser');

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.listen( process.env.PORT )
app.disable('x-powered-by')
// for auth w/o client javascript
// TODO - js on client, set localStorage
app.use(cookieParser())

// views
const views = require( './views.js' );

// routing debugger
app.use( ( req, res, next ) => {
  if ( req.url === '/favicon.ico' ) return
  console.log( 'req.headers', JSON.stringify( req.headers ) )
  console.log( 'req.url', JSON.stringify( req.url )  )
  console.log( 'req.body', JSON.stringify( req.body )  )
  console.log( 'req.query', JSON.stringify( req.query )  )
  console.log( 'req.cookies', JSON.stringify( req.cookies )  )
  console.log( 'req.method', JSON.stringify( req.method  ) + '\n\n')
  next()
} )


// routes

// index
app.get( '/', async function( req, res ) {
  console.log('req', req.decoded)
  // todo - some kind of cache
  let results = await db_interactor.getPosts();
  res.send( views.getIndex( results.reverse() ) );
} )

// auth routes
app.get( '/auth/create', async function( req, res ) {
  res.send( views.getCreateUserForm() );
} )
app.post( '/auth/login', auth.login )
app.post( '/auth/create', db_interactor.createUser )


// login view
app.get( '/login', async function( req, res ) {
  res.send( views.getLoginForm() );
} )


// this url is all wildcard
app.get( '/:author/:createdAt/:updatedAt', async ( req, res ) => {

  let { createdAt, updatedAt, author } = req.params;

  let posts = await db_interactor.getPost( createdAt )

  // passing in updated at as it's the url param key for post to edit
  res.send( views.getPostView( posts, updatedAt ) );
} )


app.use( auth.verifyToken );

app.get( '/admin', async function( req, res ) {
  res.send( 'loggedin' );
} )


app.delete( '/admin/user', auth.deleteUser )


app.get( '/admin/create', async function( req, res ) {
  res.send( views.getCreateUserForm() );
} )

app.post( '/admin/create', db_interactor.createUser )

app.get( '/admin/post', ( req, res ) => {
  res.send( views.getForm() );
} )

app.post( '/admin/post', ( req, res ) => {
  db_interactor.newPost( req );
  // then
  res.redirect( '/' );
} )

app.post( '/admin/post/edit', ( req, res ) => {
  db_interactor.updateItem( req );
  // then
  res.redirect( '/' );
} )
