  const getFoot = () => {
    return ( ` </body></html>` )
  }

  const getHead = () => {
    return (
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


  const getIndex = ( posts ) => {

    // arr of rendered elements
    let list = [];

    for ( let post of posts ) {
      let keyArr = post.key.split( '!' );
      let createdAt = keyArr[0];
      let updatedAt = keyArr[1]; // not relevant until 'post'?
      let author =keyArr[2]; // should this be in value too?
      let subject = post.value.subject;
      let body = post.value.body;

      list.push(
        `<li>
          <h4>Author: ${ author } </h4>
          <h2>Subject: ${ subject } </h5>
          <p>Body: ${ body } </p>
          <p>
            <a href="${ author }/${ createdAt }/${ updatedAt }">${ author }/${ createdAt }/${ updatedAt }</a>
          </p>
        </li>
        `
      )

      // how do i keep selected object loaded on client?

      return (
      `
        ${ getHead() }
        <a href="/admin">->admin</a>
        <a href="/admin/post">->admin/post</a>
        <br/>
        Items
        <ul>
          ${ list.join('') }
        </ul>
        ${ getFoot() }
      `
      )

    }
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
              subm
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
