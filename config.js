const path = require('path')

const CONFIG_PATH = ''

module.exports = {
  APP_NAME: 'blog',
  CONFIG_PATH: CONFIG_PATH,
  DB_PATH: ('./db'),
  USER_DB_PATH: ('./user_db'),
  KEYS_PATH: path.join(CONFIG_PATH, 'public-keys'),
  PORT: 8000,
  splitValue: '+'

}
