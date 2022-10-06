const mongoose = require('mongoose')

async function main() {
  await mongoose.connect('mongodb://localhost:27017/getapet')
  console.log( 'Conectado ao Banco de Dados - Utilizando Mongoose!' )
}

main().catch((err) => console.log(err))

module.exports = mongoose