//Helpers são trechos de códigos que reutilizaremos em várias partes da aplicação
//Neste caso verificar o token

const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//Middleware para validar o token
const checkToken = (req, res, next) => {
  if(!req.headers.authorization) {
    return res.status(401).json({ message: 'Acesso negado'})
  }

  const token = getToken(req)

  if(!token) {
    return res.status(401).json({ message: 'Acesso negado'})
  }

  try {
    const verified = jwt.verify(token, "Dfc564YhnUjnkKLLEws108")//String referente ao SECRET
    req.user = verified
    next()
  }
  catch(error) {
    return res.status(400).json({ message: 'Token inválido'})
  }
}

module.exports = checkToken