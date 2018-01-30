// // image_controller.js

const jimp = require( 'jimp' )

// process file uploads, assumes an image
const processUploads = async ( req, res, next ) => {
  let promiseArr = []
  for ( let i = 0; i < req.files.length; i++ ) {
    promiseArr.push(
      await jimp.read( req.files[ i ].buffer )
      .then( file => {
        return file
          .exifRotate()
          .write( `public/media/original/${ formatName( req.files[ i ].originalname ) }` )
          .resize( 1600, jimp.AUTO )
          .quality( 60 )
          .write( `public/media/${ formatName( req.files[ i ].originalname ) }` )
      } )
    )
  }
  return await Promise.all( promiseArr )
}

const formatName = ( name ) => {
  return name.split(' ').join('-')
}

module.exports = processUploads
