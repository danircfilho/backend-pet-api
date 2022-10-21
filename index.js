const express = require('express')
const cors = require('cors')
//const { application } = require('express')

require ('dotenv').config()

const app = express()

//Configurar respostas (response) JSON
app.use(express.json())

//Resolver o CORS - acessar a api no mesmo domínio
app.use(cors({ credentials: true, origin: 'http://apinode1.kinghost.net:21324' }))

//Receber as imagens da pasta Public
app.use(express.static('public'))

//Rotas
//Importar
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)

//const PORT = process.env.PORT
app.listen(5000)