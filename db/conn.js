const mongoose = require('mongoose')

require('dotenv').config()

async function main() {
  await mongoose.connect(process.env.MONGO_URL)
  console.log( 'BD Connect - Success!' )
}

main().catch((err) => console.log(err))

module.exports = mongoose

//conexão local compass: ('mongodb://localhost:27017/nome-do-banco')