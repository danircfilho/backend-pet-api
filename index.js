const express = require('express')
const cors = require('cors')

require ('dotenv').config()

const app = express()

//Configurar respostas (response) JSON
app.use(express.json())

//Resolver o CORS - acessar a api no mesmo domínio (React)
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Receber as imagens da pasta Public
app.use(express.static('public'))

//Rotas
//Importar
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

//const PORT = process.env.PORT
//Porta API
app.listen(5000)
