const crypto = require( 'crypto' );

const secret = require( '../secrets.js' );
const algorithm = 'aes-256-gcm';

const generateRandomKeyString = async( numBytes ) => {
  return new Promise( ( resolve, reject ) => {
    crypto.randomBytes( numBytes, ( err, buf ) => {
      if ( err ) reject( err );
      resolve( `${ buf.toString( 'hex' ) }` )
    } );
  } )
}

const encrypt = ( text ) => {
  let cipher = crypto.createCipher( algorithm, secret.key )
  let crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

const decrypt = ( text ) => {
  let decipher = crypto.createDecipher( algorithm, secret.key )
  let dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
//
// generateRandomKeyString( 32 )
//   .then( results => {
//     console.log( results )
//   })

let x = encrypt( 'mobile phone' )
console.log( x )

console.log( decrypt( x ) )
