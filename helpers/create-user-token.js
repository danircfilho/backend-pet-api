//Helpers são trechos de códigos que reutilizaremos em várias partes da aplicação
//Neste caso na criação do token

const jwt = require('jsonwebtoken')

const createUserToken = async(user, req, res) => {
  //Criar o token
  const token = jwt.sign({
    name: user.name,
    id: user.id
  }, "Dfc564YhnUjnkKLLEws108") //String referente ao SECRET que fortifica o jwt(token)

  //Retornar o token
  res.status(200).json({message: "Autenticado com sucesso", token: token, userId: user._id,})
}

module.exports = createUserToken