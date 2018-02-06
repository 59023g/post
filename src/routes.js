// routes.js
const express = require('express')
const router = express.Router()

// view_controller
const view_controller = require( './view_controller.js' );
const auth_controller = require( './auth_controller.js' );
const db_controller = require( './db_controller.js' );


// uploads
const multer = require( 'multer' )
const upload = multer()
const processUploads = require( './image_controller.js' )

// index
router.get( '/', async function ( req, res ) {
  // TODO - some kind of cache
  let results = await db_controller.getPosts();
  return res.send( await view_controller.getIndex( results.reverse(), req.cookies ) );
} )

// auth routes
router.post( '/auth/login', auth_controller.login )
router.get( '/auth/logout', ( req, res ) => {
  res.clearCookie( 'Token' )
  res.clearCookie( 'Author' )
  res.redirect( '/blog' )
} )


// login view
router.get( '/login', async function ( req, res ) {
  res.send( view_controller.getLoginForm() );
} )

// this url is all wildcard
router.get( '/:author/:createdAt/:updatedAt', async ( req, res ) => {
  let { createdAt, updatedAt, author } = req.params;
  let posts = await db_controller.getPost( createdAt )
  if ( posts.length === 0 ) return res.status( 404 ).json( 'Not Found' )
  // passing in updated at as it's the url param key for post to edit
  return res.send( await view_controller.getPostView( posts, updatedAt, req.cookies ) )
} )

router.post( '/auth/create', db_controller.createUser )
router.get( '/admin/create', async function ( req, res ) {
  res.send( view_controller.getCreateUserForm() );
} )

// everything after this requires auth token
router.use( auth_controller.verifyToken );

router.get( '/admin', async function ( req, res ) {
  let items = await db_controller.getPosts();
  res.send( await view_controller.getAdminView( items.reverse(), req.cookies ) );
} )


router.post( '/auth/create', db_controller.createUser )
router.get( '/admin/create', async function ( req, res ) {
  res.send( view_controller.getCreateUserForm() );
} )

router.delete( '/admin/user', auth_controller.deleteUser )

router.post( '/admin/create', db_controller.createUser )

router.get( '/admin/post', ( req, res ) => {
  res.send( view_controller.getForm() );
} )

router.post( '/admin/post', ( req, res ) => {
  db_controller.newPost( req );
  // then
  res.redirect( '/blog' );
} )

router.post( '/admin/post/edit', ( req, res ) => {
  db_controller.updateItem( req );
  // then
  res.redirect( '/blog' );
} )

// only supports images for now
router.post( '/upload', upload.array( 'file', 12 ), async ( req, res ) => {
  if ( !req.files )
    return res.status( 400 ).send( 'No files were uploaded.' );

  try {
    await processUploads( req )
    res.redirect( '/admin' )
  } catch ( error ) {
    console.error( '/upload error: ', error )
  }

} );


module.exports = router
