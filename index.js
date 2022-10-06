const express = require('express')
const cors = require('cors')
const { application } = require('express')

const app = express()

//Configurar respostas (response) JSON
app.use(express.json())

//Resolver o CORS - acessar a api no memso domínio
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

//Receber as imagens da pasta Public
app.use(express.static('public'))

//Rotas
//Importar
const UserRoutes = require('./routes/UserRoutes')

app.use('/users', UserRoutes)


app.listen(5000)