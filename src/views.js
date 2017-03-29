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
          textarea { height: 100px; }
        </style>
      </head>
      <body>
      -> <a href="/admin">admin</a>
      -> <a href="/admin/post">admin/post</a>
      -> <a href="/">items</a>
      <br/>
      <br/>

      ` )
  }


  const getIndex = ( posts ) => {
    // arr of rendered posts
    let list = [];

    for ( let post of posts ) {
    console.log( post )

      // parse post

      let keyObj = util.splitKey( post.key );
      let subject = post.value.subject;
      let body = post.value.body;

      // put each post into loop
      list.push(
        `<li>
          <h4>${ subject } by ${ keyObj.author } on ${ keyObj.updatedAt }</h4>
          <p> ${ body } </p>
          <p>
            <a href="${ keyObj.author }/${ keyObj.createdAt }/${ keyObj.updatedAt }">${ keyObj.author }/${ keyObj.createdAt }/${ keyObj.updatedAt }</a>
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
      <ul>
        ${ list.join('') }
      </ul>
      ${ getFoot() }
    `
    )

  }

  const getForm = () => {
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

  module.exports = {
    getFoot: getFoot,
    getHead: getHead,
    getIndex: getIndex,
    getForm: getForm
  }
