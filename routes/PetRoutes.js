const router = require('express').Router()
const PetController = require('../controllers/PetController')

//Rotas com as funções obtidas do controller
router.post('/ceate', PetController.create)

module.exports = router