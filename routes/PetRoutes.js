const router = require('express').Router()
const PetController = require('../controllers/PetController')

//Middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//Rotas com as funções obtidas do controller
//Rotas publicas
router.get('/', PetController.getAll)
router.get('/:id', PetController.getPetById)

//Rotas privadas
//imageUpload com array para várias imagens
router.post('/create', verifyToken, imageUpload.array("images"), PetController.create) 
router.get('/mypets', verifyToken, PetController.getAllUserPets) 
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoption) 
router.delete('/:id', verifyToken, PetController.removePetById) 

module.exports = router