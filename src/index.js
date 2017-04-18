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

app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.listen( process.env.PORT )
app.disable('x-powered-by')

// views
const views = require( './views.js' );


app.use( auth.verifyToken );


// routes
app.get( '/login', async function( req, res ) {
  res.send( views.getLoginForm() );
} )

app.delete( '/admin/user', auth.deleteUser )

app.get( '/admin/', async function( req, res ) {
  res.send( 'loggedin' );
} )

// user id?, post id?

app.post( '/admin/login', auth.login )


app.get( '/admin/create', async function( req, res ) {
  res.send( views.getCreateUserForm() );
} )

app.post( '/admin/create', auth.createUser )

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

app.get( '/', async function( req, res ) {
  console.log('req', req.decoded)
  // todo - some kind of cache
  let results = await db_interactor.getPosts();
  res.send( views.getIndex( results.reverse() ) );
} )

// this url is all wildcard
app.get( '/:author/:createdAt/:updatedAt', async ( req, res ) => {

  let { createdAt, updatedAt, author } = req.params;

  let posts = await db_interactor.getPost( createdAt )

  // passing in updated at as it's the url param key for post to edit
  res.send( views.getPostView( posts, updatedAt ) );
} )
