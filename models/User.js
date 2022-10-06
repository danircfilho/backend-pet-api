const mongoose = require('../db/conn')
const { Schema } = mongoose

const User = mongoose.model(
  'User',
  new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String, //a imagem virá pelo caminho do arquivo
    },
    phone: {
      type: String,
      required: true
    }
  }, 
  { timestamps: true }, //createdAt, updatedAt
  ),
)

module.exports = User
