const config = require( '../config.js' );

const lastArr = ( arr ) => {
  return arr[arr.length - 1 ];
}

const splitKey = ( key ) => {
  let keyArr = key.split( config.splitValue );

  let keyObj = {
    createdAt: keyArr[ 0 ],
    updatedAt: keyArr[ 1 ],
    author: keyArr[ 2 ]
  };

  return keyObj
}

module.exports = {
  lastArr: lastArr,
  splitKey: splitKey
}
