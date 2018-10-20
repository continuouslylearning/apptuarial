const bcrypt = require('bcryptjs');

const passwords = ['password', 'secret', 'javascript'];

Promise.all(passwords.map(password => bcrypt.hash(password, 10)))
  .then(hashes => console.log(hashes));