const express = require('express')
const cors = require('cors')
const { application } = require('express')

const app = express()

//Configurar respostas (response) JSON
app.use(express.json())

//Resolver o CORS - acessar a api no memso domínio
app.use(cors({ credentials: true, origin: 'apinode1.kinghost.net:21344' }))

//Receber as imagens da pasta Public
app.use(express.static('public'))

//Rotas
//Importar
const UserRoutes = require('./routes/UserRoutes')
const PetRoutes = require('./routes/PetRoutes')

app.use('/users', UserRoutes)
app.use('/pets', PetRoutes)


app.listen(21344)