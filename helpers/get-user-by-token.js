//Helpers são trechos de códigos que reutilizaremos em várias partes da aplicação
//Neste caso pegar o usuário pelo token

const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Pegar o usuário por token
const getUserByToken = async (token) => {

  if(!token) {
    return res.status(401).json({ message: 'Acesso negado'})
  }

  const decoded = jwt.verify(token, "Dfc564YhnUjnkKLLEws108") //String referente ao SECRET
  const userId = decoded.id
  const user = await User.findOne({ _id: userId})

  return user
}

module.exports = getUserByToken