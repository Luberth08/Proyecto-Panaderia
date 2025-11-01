const bcrypt = require('bcrypt');

async function run() {
  const plain = 'rodrigo123'; // Contraseña a Hashear
  const saltRounds = 10;           
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(plain, salt);
  console.log('Plain:', plain);
  console.log('Salt rounds:', saltRounds);
  console.log('Hashed:', hashedPassword);
}

run().catch(err => console.error(err));