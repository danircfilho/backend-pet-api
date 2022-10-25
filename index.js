const express = require('express')
const cors = require('cors')

//require ('dotenv').config()

const app = express()

//Configurar respostas (response) JSON
app.use(express.json())

//Resolver o CORS - URL da origem (solicitante da requisição)
app.use(cors({ credentials: true, origin: 'https://magnificent-sunburst-a1ddce.netlify.app/' }))

//Receber as imagens da pasta Public
app.use(express.static('public'))

//Rotas
//Importar
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

//Porta API
const PORT = process.env.PORT || 3000

app.listen(PORT)

//app.listen(3000) - usar direto no localhost

