const util = require( './util.js' );

  const getFoot = () => {
    return ( ` </body></html>` )
  }

  const getHead = () => {

    // todo - selected nav page
    return (
      `
      <html>
      <head>
        <style>
          body {
            font-family: monospace;
            max-width: 600px;
            margin: 0 auto;
            padding: 12px }
          div, .padding-bottom-8 { padding-bottom: 8px; }
          ul { padding: 0; list-style-type: none; }
          input, textarea { width: 100%; }
          textarea { height: 400px; }
          img { width: 100%; height: auto; padding: 12px 0;}
        </style>
      </head>
      <body>
      -> <a href="/admin">admin</a>
      -> <a href="/admin/create">admin/create</a>
      -> <a href="/admin/post">admin/post</a>
      -> <a href="/">items</a>
      <br/>
      <br/>

      ` )
  }


  const getPostView = ( posts, updatedAt ) => {

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
      ${ getHead() }
      edit
      <ul>
        ${ getUpdateForm( edit ) }
        <a href="">edit</a>
      </ul>
      history
      <ul>
        ${ history.join('') }
      </ul>
      ${ getFoot() }
    `
    )

  }


  const getIndex = ( items ) => {
    // arr of rendered posts

    let list = [];

    for ( let item of items ) {

      // put each post into loop
      list.push(
        `<li>
          ${ itemToMarkup( item ) }
          <p>
            <a href="${ item.author }/${ item.createdAt }/${ item.updatedAt }">${ item.author }/${ item.createdAt }/${ item.updatedAt }</a>
          </p>
        </li>
        `
      )
    }

    // how do i keep selected object loaded on client?
    // is this the right url format?
    // how will people create custom, subject based urls, but still get what they want? with lookup by subject?

    return (
    `
      ${ getHead() }
      all items
      <ul>
        ${ list.join('') }
      </ul>
      ${ getFoot() }
    `
    )

  }

  const itemToMarkup = ( item ) => {
    return (
      `
        <h4>${ item.subject } by ${ item.author } on ${ item.updatedAt }</h4>
        <p> ${ item.body } </p>
      `
    )
  }

  const getCreateUserForm = () => {
      let form =
        `
          ${ getHead() }
            create user:
            <form method='post' action='/admin/create'>
              <div>
                user
                <input type='text' name='user'>
              </div>
              <div>
                pass
                <input type='password' name='pass'></input>
              </div>
              <div>
                pass again
                <input type='password' name='pass-dupe'></input>
              </div>
              <div>
                <input type='submit' value='submit'>
              </div>
            </form>
          ${ getFoot() }
          `
      return form

  }

const getLoginForm = () => {
    let form =
      `
        ${ getHead() }
          login:
          <form method='post' action='/admin/login'>
            <div>
              user
              <input type='text' name='user'>
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

  const getForm = ( ) => {

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
              <input type='submit' value='submit'>
            </div>
          </form>
        ${ getFoot() }
        `
    return form
  }

  const getUpdateForm = ( item ) => {
    console.log( 'item', item )
    let form =
      `
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
            <input type="checkbox" id="hiddenFromIndex" value="hiddenFromIndex">
            <label for="hiddenFromIndex">hiddenFromIndex</label>
            <div>
              <input type='submit' value='submit'>
            </div>
          </form>
        `
    return form
  }

  module.exports = {
    getFoot: getFoot,
    getPostView: getPostView,
    getHead: getHead,
    getIndex: getIndex,
    getForm: getForm,
    getCreateUserForm: getCreateUserForm,
    getLoginForm: getLoginForm
  }
