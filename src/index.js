const dotenv = require( 'dotenv' ).config();

// server ( express mostly for the router )
const express = require( 'express' )
const bodyParser = require( 'body-parser' );
const cookieParser = require( 'cookie-parser' );

const app = express()
app.use( '/public', express.static( process.cwd() + '/public' ) )
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );
app.listen( process.env.PORT )
app.disable( 'x-powered-by' )
app.use( cookieParser() )

// db
const db_controller = require( './db_controller.js' );

// auth
const jwt = require( 'jsonwebtoken' );
const auth_controller = require( './auth_controller.js' );

// view_controller
const view_controller = require( './view_controller.js' );

// uploads
const multer = require( 'multer' )
const upload = multer()
const processUploads = require( './image_controller.js' )

// routing debugger
app.use( ( req, res, next ) => {
  if ( req.url === '/favicon.ico' ) return
  console.log( JSON.stringify( req.method ), JSON.stringify( req.url ), 'body: ', JSON.stringify( req.body ), 'query: ', JSON.stringify( req.query ), 'cookies:', JSON.stringify( req.cookies ) + '\n' )
  next()
} )

// TODO - abstract routes

// index
app.get( '/', async function ( req, res ) {
  // TODO - some kind of cache
  let results = await db_controller.getPosts();
  return res.send( await view_controller.getIndex( results.reverse(), req.cookies ) );
} )

// auth routes
app.post( '/auth/login', auth_controller.login )
app.get( '/auth/logout', ( req, res ) => {
  res.clearCookie( 'Token' )
  res.clearCookie( 'Author' )
  res.redirect( '/' )
} )


// login view
app.get( '/login', async function ( req, res ) {
  res.send( view_controller.getLoginForm() );
} )

// this url is all wildcard
app.get( '/:author/:createdAt/:updatedAt', async ( req, res ) => {
  let { createdAt, updatedAt, author } = req.params;
  let posts = await db_controller.getPost( createdAt )
  if ( posts.length === 0 ) return res.status( 404 ).json( 'Not Found' )
  // passing in updated at as it's the url param key for post to edit
  return res.send( await view_controller.getPostView( posts, updatedAt, req.cookies ) )
} )

app.post( '/auth/create', db_controller.createUser )
app.get( '/admin/create', async function ( req, res ) {
  res.send( view_controller.getCreateUserForm() );
} )

// everything after this requires auth token
app.use( auth_controller.verifyToken );

app.get( '/admin', async function ( req, res ) {
  let items = await db_controller.getPosts();
  res.send( await view_controller.getAdminView( items.reverse(), req.cookies ) );
} )

app.post( '/auth/create', db_controller.createUser )
app.get( '/admin/create', async function ( req, res ) {
  res.send( view_controller.getCreateUserForm() );
} )

app.delete( '/admin/user', auth_controller.deleteUser )

app.post( '/admin/create', db_controller.createUser )

app.get( '/admin/post', ( req, res ) => {
  res.send( view_controller.getForm() );
} )

app.post( '/admin/post', ( req, res ) => {
  db_controller.newPost( req );
  // then
  res.redirect( '/' );
} )

app.post( '/admin/post/edit', ( req, res ) => {
  db_controller.updateItem( req );
  // then
  res.redirect( '/' );
} )

// only supports images for now
app.post( '/upload', upload.array( 'file', 12 ), async ( req, res ) => {
  if ( !req.files )
    return res.status( 400 ).send( 'No files were uploaded.' );

  try {
    await processUploads( req )
    res.redirect( '/admin' )
  } catch ( error ) {
    console.error( '/upload error: ', error )
  }

} );
