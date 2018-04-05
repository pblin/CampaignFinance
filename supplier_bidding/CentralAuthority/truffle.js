// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 6600000,
from:'0x68a2819bd9039ed91d8a73f0b0477bd25d06a587',
      network_id: '*' // Match any network id
    }
  }
}
