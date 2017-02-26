const send = require( 'micro' ).send
const db = require( '../db.js' )

module.exports = async function routes( path, req, res ) {
  console.log( 'path: ', path )

  switch ( path ) {
    case '/':

      let parsedData =[]

      var valueStream = db.createValueStream()
      valueStream.on('error', function (err) {
        console.error('valueStream.on error ' + err.message);
      });
      valueStream.pipe( send( res, 200, parsedData ) );
      response('error', function (err) {
        console.error('response error ' + err.message);
      });
      //
      //  db.createReadStream({ reverse: true })
      //  .on('data', function (data) {
      //     parsedData.push( data )
      //   })
      //   .on('error', function (err) {
      //     console.log('Oh my!', err)
      //   })
      //   .on('close', function () {
      //     console.log('Stream closed')
      //   })
      //   .on('end', function (data) {
      //     console.log('Stream ended')
      //     send( res, 200, parsedData )
       //
      //   })
        // console.log('data', streamdata)
      // .pipe( send( res, 200, data ) )
      break;
    case '/admin':
      break;
    case '/admin/post':
      return await post( req, res )
      break;
    default:
      send( res, 404, {
        status: 404,
        message: 'not found'
      } )

  }
}


async function post( req, res ) {
  let form =
    `
      ${ getHead() }
        <form method='post' action='/admin/post'>
          <input type='text' name='subject'>
          <input type='submit' value='submit'>
        </form>
      ${ getFoot() }

      `


   await send( res, 200, form )
}

 function getHead() {
  return  (
    `
    <html>
    <head>

    </head>
    <body>

    ` )
}

function getFoot() {
  return ( ` </body></html>` )
}
