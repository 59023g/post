const util = require( './util.js' );
const fs = require( 'fs' )
const media_dir = process.env.MEDIADIR

const getFoot = () => {
  return ( ` </body></html>` )
}

const isLoggedin = async ( cookies ) => {

  // console.log( 'cookies', cookies )
  if ( Object.keys( cookies ).length > 0 && cookies.constructor === Object ) {
    return true
  } else {
    return false
  }

}
const getHead = ( loggedIn ) => {

  // todo - selected nav page
  return (
    `
      <html>
      <head>
        <title>Michael Pierce</title>
        <meta charset="UTF-8">
        <link type='text/css' href='/public/style.css' rel='stylesheet'>
        <meta content="width=device-width,user-scalable=no" name="viewport">
        <meta name="google" content="notranslate">
        <meta http-equiv="Content-Language" content="en">
      </head>
      <body>
      <a href="/">home</a>
      ${ loggedIn ? `| <a href="/auth/logout">logout</a> | <a href="/admin">admin</a>` : ''   }
      | <h4 style='display: inline'>mep.im</h4>
      <hr>

      ` )
}


const getPostView = async ( posts, updatedAt, cookies ) => {

  let loggedIn = await isLoggedin( cookies )

  // for now i'm seeing all posts return in reverse chrono order, so..
  let filteredArr = posts.reverse();

  let history = [];
  let edit = {}
  /*
    input list of all posts with same createdAtkey,
    return latest
    if admin, enable editing and history
  */

  for ( item of filteredArr ) {

    // TODO edit old items? if createdAt param, send to absolute
    if ( item.updatedAt === updatedAt ) {
      edit = item
    }

    // TODO - some kind of cache so we're not making new calls if editing posts
    history.push(
      `
        <li>
          ${ item.subject }
          -> <a href="/${ item.author }/${ item.createdAt }/${ item.updatedAt }">${ item.author }/${ item.createdAt }/${ item.updatedAt }</a>
        </li>
        `
    )
  }

  return (
    `
      ${ getHead( loggedIn ) }
      <ul>
        ${ loggedIn ? getUpdateForm( edit ) : renderPost( edit )  }
      </ul>
      <h4>history</h4>
      <ul>
        ${ history.join('') }
      </ul>
      ${ getFoot() }
    `
  )

}

const itemToMarkup = ( item, options ) => {
  return (
    `
        <h4>
          <a href="/${ item.author }/${ item.createdAt }/${ item.updatedAt }">${ item.subject ? item.subject : item.author }</a> <br> by ${ item.author } on ${ domFormatDate( item.updatedAt ) }
        </h4>
        <p> ${ item.body } </p>
      `
  )
}

const itemsList = ( items, options ) => {
  if ( !options ) options = {}

  let list = [];

  // <a href="/${ item.author }/${ item.createdAt }/${ item.updatedAt }">link</a>

  let html = ( item ) => {
    return list.push(
      `<li>
        <h4>
          <a href="/${ item.author }/${ item.createdAt }/${ item.updatedAt }">${ item.subject ? item.subject : 'no title' }</a> <br> by ${ item.author } on ${ domFormatDate( item.updatedAt ) }
        </h4>
        ${ options.noBody ? '' : `<p> ${ item.body } </p><hr>`}

      </li>
      `
    )
  }

  for ( let item of items ) {

    // console.log(  item.hiddenFromIndex )
    if ( !item.hiddenFromIndex && !options.showAll ) {
      // put each post into loop
      html( item )
    }

    if ( options.showAll ) {
      html( item )
    }

  }

  return `${ list.join('') }`

}

const itemsShortList = ( items ) => {
  let list = []


}
const getIndex = async ( items, cookies ) => {
  // arr of rendered posts
  // how do i keep selected object loaded on client?
  // is this the right url format?
  // how will people create custom, subject based urls, but still get what they want? with lookup by subject?
  let loggedIn = await isLoggedin( cookies )

  return (
    `
      ${ getHead( loggedIn ) }
      <ul>
      ${ itemsList( items, { showAll: false, noBody: false} ) }
      </ul>
      ${ getFoot() }
    `
  )

}

// basic date render for HTML
const domFormatDate = ( date ) => {
  let test = new Date( +date )
  testObj = {
    day: addZeroLeftPad( test.getDate() ),
    month: addZeroLeftPad( test.getMonth() + 1 ),
    year: test.getFullYear(),
    hour: addZeroLeftPad( test.getHours() ),
    minute: addZeroLeftPad( test.getMinutes() )
  }
  let options = { hour12: false, hour: 'numeric' }
  return `${ testObj.year }/${ testObj.month }/${ testObj.day } ${ testObj.hour }:${ testObj.minute }`
}

const addZeroLeftPad = ( value ) => {
  const stringVal = value.toString()
  if ( stringVal.length === 1 ) return '0' + stringVal
  return value
}


const getCreateUserForm = () => {


  let form =
    `
          ${ getHead() }

        <script>
        window.crypto.subtle.generateKey( {
            name: "HMAC",
            hash: {
              name: "SHA-256"
            }
          },
          true, [ "sign", "verify" ]
        )
        .then( key => {
          return window.crypto.subtle.exportKey(
            "jwk",
            key
          )
        } )
        .then( results => {
          let input = document.querySelector( 'input[name=clientToken]' )
          input.setAttribute( "value", results.k )
        } )
        .catch( function( err ) {
          console.error( err );
        } );
        </script>

            create admin user:
            <form method='post' action='/auth/create'>
              <div>
                author
                <input type='text' name='author'>
              </div>
              <div>
                pass
                <input type='password' name='pass'></input>
              </div>
              <div>
                pass again
                <input type='password' name='pass-dupe'></input>
              </div>
              <input type="hidden" name="clientToken" value="">
              <div>
                <input type='submit' value='submit'>
              </div>
            </form>
          ${ getFoot() }
          `
  return form

}

const getLoginForm = () => {

  // send an auth token from the server
  // use that token to sign, but then I need to rememeber it?!
  // unless it's a public key..

  let form =
    `
        ${ getHead() }
          <h4>login:</h4>
          <form method='post' action='/auth/login'>
            <div>
              user
              <input type='text' name='author'>
            </div>
            <div>
              pass
              <input type='password' name='pass'></input>
            </div>
            <div>
              <input type='submit' value='submit'>
            </div>
          </form>
        ${ getFoot() }
        `
  return form

}

const getAdminHead = () => {
  const view = `
      <a href="/admin/create">admin/create</a>
      | <a href="/admin/post">admin/post</a>
      <br>
      <br>
    `
  return view
}

const getFiles = async () => {

  let hidden = [ 'original', '.DS_Store' ]

  let files = await fs.readdirSync( media_dir )

  for ( let i = 0; i < hidden.length; i++ ) {
    let index = files.indexOf( hidden[ i ] )
    if ( index > -1 ) {
      files.splice( index, 1 );
    }
  }

  return files

}

const getAdminView = async ( items, cookies ) => {
  let loggedIn = await isLoggedin( cookies )

  const view = `
  ${ getHead( loggedIn ) }

        ${ getAdminHead() }
        ${ getForm( loggedIn ) }
        ${ await getFiles() }

        <ul>
        ${ itemsList( items, { showAll: true, noBody: true } ) }
        </ul>
    `
  return view
}

// react primitives
const getForm = ( loggedIn ) => {

  let form =
    `
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
          <input type='submit' value='submit'>
        </div>
      </form>
      <form ref='uploadForm'
        id='uploadForm'
        action='/upload'
        method='post'
        encType="multipart/form-data">
          <input type="file" name="file" />
          <input type="file" name="file" />
          <input type="file" name="file" />
          <input type="file" name="file" />
          <input type="file" name="file" />
          <input type="file" name="file" />
          <input type='submit' value='Upload!' />
      </form>
    ${ getFoot() }
    `
  return form
}

const renderPost = ( item ) => {

  return `
    <h4>${ item.subject }</h4>
    <p>${ item.body }</p>

    `
}

const getUpdateForm = ( item ) => {
  // console.log( 'item', item )
  let form =
    `
    <h4>edit</h4>

          <form method='post' action='/admin/post/edit'>
            <div>
              subj
              <input type='text' name='subject' value=${ JSON.stringify( item.subject ) }>
            </div>
            <div>
              body
              <textarea name='body'>${ item.body }</textarea>
            </div>
            <!-- This is the original creation value of item -->
            <input type="hidden" name="createdAt" value="${ item.createdAt }">
            <input type="checkbox" id="hiddenFromIndex" name="hiddenFromIndex" value="${ item.hiddenFromIndex }">
            <label for="hiddenFromIndex">hiddenFromIndex ${ item.hiddenFromIndex }</label>
            <div>
              <input type='submit' value='submit'>
            </div>
          </form>
          <form ref='uploadForm'
            id='uploadForm'
            action='/upload'
            method='post'
            encType="multipart/form-data">
            <input type="file" name="file" />
            <input type="file" name="file" />
            <input type="file" name="file" />
            <input type="file" name="file" />
            <input type="file" name="file" />
            <input type="file" name="file" />
              <input type='submit' value='Upload!' />
          </form>

        `
  return form
}

module.exports = {
  getFoot: getFoot,
  getPostView: getPostView,
  getHead: getHead,
  getIndex: getIndex,
  getAdminView: getAdminView,
  getForm: getForm,
  getCreateUserForm: getCreateUserForm,
  getLoginForm: getLoginForm
}
