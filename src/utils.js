// utils.js

const lastArrItem = ( arr ) => {
  return arr[arr.length - 1 ];
}

const splitKey = ( key ) => {
  let keyArr = key.split( process.env.SPLIT_VALUE );
  let keyObj = {
    createdAt: keyArr[ 0 ],
    updatedAt: keyArr[ 1 ],
    author: keyArr[ 2 ]
  };
  return keyObj
}

const sortDescUpdatedAt = ( a, b ) => {
  return  b.updatedAt - a.updatedAt;
}

module.exports = {
  lastArrItem: lastArrItem,
  sortDescUpdatedAt: sortDescUpdatedAt,
  splitKey: splitKey
}
