const send = require( 'micro' ).send
const db = require( '../db.js' )

module.exports = async function routes( path, req, res ) {
  console.log( 'path: ', path )
  console.log( /^\/post\/./.test(path) )

  switch ( path ) {
    case '/':

      let dataStreamArr =[]

       db.createReadStream({ reverse: true })
       .on('data', function ( data ) {

         let dataValue = data.value.data

         if ( !data.value.data.author ) {
           dataValue.author = null;
         }

         if ( !dataValue.subject ) {
           dataValue.subject = null;
         }

         if ( !dataValue.body ) {
           dataValue.body = null;
         }

         let processData = {
           author: dataValue.author,
           postDate: data.key.split('!')[1],
           subject: dataValue.subject,
           body: dataValue.body
         }

         dataStreamArr.push( processData )
        })
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('close', function () {
          console.log('Stream closed')
        })
        .on('end', function () {
          console.log('Stream ended')
            view( req, res, dataStreamArr )

        })
      break;
    case ( /^\/post\/./.test(path) ):
      console.log('match')
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
          <div>
            subj
            <input type='text' name='subject'>
          </div>
          <div>
            body
            <textarea name='body'></textarea>
          </div>
          <div>
            subm
            <input type='submit' value='submit'>
          </div>
        </form>
      ${ getFoot() }
      `


   await send( res, 200, form )
}

async function view( req, res, data ) {

  let list = []

  for (var i = 0; i < data.length; i++) {
      list.push(
        `<li>
          <h4>Author: ${ data[i].author } </h4>
          __
          <h5>Subject: ${ data[i].subject  } </h5>
          __
          <p>Body: ${ data[i].body  } </p>
          __
          <p><a href="post/${ data[i].postDate }">${  data[i].postDate   }</a></p>
        </li>
        `
      )
  }

  let form =
      `
        ${ getHead() }
        <ul>
          ${ list.join('') }
        </ul>
        ${ getFoot() }
      `


   await send( res, 200, form )
}

 function getHead() {
  return  (
    `
    <html>
    <head>
      <style>
        body { font-family: monospace }
        div, .padding-bottom-8 { padding-bottom: 8px }

      </style>
    </head>
    <body>

    ` )
}

function getFoot() {
  return ( ` </body></html>` )
}
