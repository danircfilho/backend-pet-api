const mongoose = require('../db/conn')
const { Schema } = mongoose

const Pet = mongoose.model(
  'Pet',
  new Schema({
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    weigth: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    images: {
      type: Array,
      required: true
    },
    available: {
      type: Boolean
    },
    //dados do usuário e adotante
    user: Object,
    adopter: Object
  }, 
  { timestamps: true }, //add: createdAt, updatedAt
  ), 
)

module.exports = Pet