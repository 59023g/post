In production: https://mep.im/blog

Tired of bloat, and wanting to experiment with an immutable DB structure, I built this. It's still somewhat a work in progress, but suits my needs for now. It does authentication ( using JWT ), state ( leveldb - no separate service like mongo, redis ), and very basic views with media uploads ( no frameworks - just string interpolation ).

I'd be curious to see what others think or add to it. It's open source. I chose leveldb to start off with so easily replicable. As of now, the data is immutable, but it's not chained.

#### stack
* node ( express )
* leveldb

<img src='https://mep.im/blog/public/media/screen_blog.png' width=450>

There is no delete or update in the database. You are effectively allowed to update a DB entry per the schema:

```
// create entry 
itemsDb.put(
  now + // createdAt in 'update' below
  process.env.SPLIT_VALUE + now + // createdAt in 'update' below
  process.env.SPLIT_VALUE + author,
  content,  ( err ) => {
    if ( err ) return console.log( 'err', err )
    return Promise.resolve()
  }
)

// update entry 
itemsDb.put(
  createdAt + // 'now' on creation 
  process.env.SPLIT_VALUE + now + // when actual update
  process.env.SPLIT_VALUE + author,
  content,  ( err ) => {
    if ( err ) return console.log( 'err', err )
    return Promise.resolve()
  }
)
```
This leads us with a schema that always begins with when the item was created with, then if it's updated, a new entry is created with the same `createdAt`, but a new `now` so we have a clean state history for all entries and URLs that look like: 
`/mep/1517878128911/1517879159016`. The next step would be to somehow chain the entries for some kind of blockchain blog ( ICO dropping 2019 ... LOL ). 


The frontend only needs JavaScript when creating a user. Other than that, everything is server-rendered and without client-side JavaScript. This is part experiment in reducing over-framework, over-JavaScript discipline and part for super performance. 

