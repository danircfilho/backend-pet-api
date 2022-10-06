//Helpers são trechos de códigos que reutilizaremos em várias partes da aplicação
//Neste caso extrair o token

const getToken = (req) => {
  /*
  será extraído a string da segunda posição (índice) 
  da requisição que vem do header (Bearer [0] + String Token [1])
  */
  const authHeader = req.headers.authorization
  const token = authHeader.split(" ")[1]

  return token 
} 

module.exports = getToken 