const router = require('express').Router()
const PetController = require('../controllers/PetController')

//Middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//Rotas
//Não mudar ordem de leitura das rotas - de cima para baixo o código descorre...
router.post('/create', verifyToken, imageUpload.array("images"), PetController.create) 
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets) 
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions) 
router.get('/:id', PetController.getPetById)
router.delete('/:id', verifyToken, PetController.removePetById) 
router.patch('/:id', verifyToken, imageUpload.array("images"), PetController.updatePet) 

module.exports = router